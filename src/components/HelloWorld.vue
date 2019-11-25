<template>
<div class="hello">
  <center>
    <div class="title">
      <h1>Slack 検索</h1>
    </div>
    <div class="submenu">
      <select v-model="pulldowns" v-cloak class="btn channel" style="border:1px black solid">
        <option disabled class="colors" value="">!!チャネル選択!!</option>
        <option value="CN7PT9NKU">#web</option>
        <option value="CN7PT9KU2">#random</option>
        <option value="CN937U5RR">#general</option>
      </select>
      <select v-model="usrname" v-cloak style="border:1px black solid" class="btn userselect">
        <option disabled value="" class="colors" style="color:red">ユーザー選択</option>
        <option value="yuto_kun">yuto_kun</option>
        <option value="tomoya">tomoya</option>
      </select>
      <input type="text" v-model="keyword" placeholder="メッセージ入力" class="search btn" style="border:1px black solid" @keydown.enter="filterItems">
      <div class="bye"><input type="submit" v-on:click="filterItems" value="検索" class="sousin" style="border:1px black solid"></div>
    </div>
    <table border=1 v-cloak class="fixed" v-if="filteredItems.length">
      <tbody class="list">
        <tr>
          <th class="name">ユーザー名</th>
          <th class="messe">メッセージ</th>
          <th class="ts" v-on:click="sortTime">
            時間 ▼
          </th>
          <th class="reactions">リアクション</th>
        </tr>
        <tr v-for="item in filteredItems" :key='item'>
          <td>
            <ul>
              <li v-for="name in membersName" v-if="item.user==name.id" class="name" :key='name'>
                {{name.real_name}}
              </li>
            </ul>
          </td>
          <td class="text">
            <a v-bind:href="'https://yutoun.slack.com/archives/'+ pulldowns + '/p' + item.ts*1000000" target="_blank">{{item.text}}</a>
          </td>
          <td>
            {{item.ts | time}}
          </td>
          <td>
            <div v-if="item.reactions" class="reactions">
              {{item.reactions[0].name | emoji}}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!filteredItems.length" class="noResult">現在の検索結果は0件です</p>
    </center>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      items: null,
      keyword: '',
      filteredItems: [],
      membersName: [],
      pulldowns: '',
      usrname: '',
      usr_ids: '',
      display: false
    }
  },
  filters: {
    time: function (value) {
      var today = new Date(Number(value * 1000))
      var month = today.getMonth() + 1
      var day = today.getDate()
      var hour = today.getHours()
      var min = today.getMinutes()
      return month + '月' + day + '日' + hour + '時' + min + '分'
    },
    emoji: function (reactions) {
      const emoji = require('node-emoji')
      return emoji.get(reactions)
    }
  },
  methods: {
    getItems: function (callback) {
      var params = {
        page: 1,
        per_page: 20,
        query: this.keyword,
        channel: this.pulldowns
      }
      this.$axios.get('https://slack.com/api/channels.history?token=xoxp-762165440097-755809321058-849259141270-5133ad9cb20141e8cd5d49ac6ac563e2', {params})
        .then(response => {
          this.items = response.data.messages
          this.$axios.get('https://slack.com/api/users.list?token=xoxp-762165440097-755809321058-849259141270-5133ad9cb20141e8cd5d49ac6ac563e2&pretty=1')
            .then(response => {
              this.membersName = response.data.members
              callback()
            })
        })
    },
    filterItems: function () {
      this.getItems(() => {
        if (this.pulldowns === '') {
          return window.alert('チャネル名を入れてください')
        }
        for (let i in this.membersName) {
          if (this.membersName[i].real_name.includes(this.usrname)) {
            this.usr_ids = this.membersName[i].id
          }
        }
        let filtered = []
        for (let i in this.items) {
          if (this.usrname === '') {
            if (this.items[i].text.includes(this.keyword)) {
              filtered.push(this.items[i])
            }
          } else if (this.items[i].text.includes(this.keyword) &&
            this.items[i].user === this.usr_ids) {
            filtered.push(this.items[i])
          }
        }
        this.filteredItems = filtered
      })
    },
    sortTime: function () {
      this.filteredItems.sort(function (a, b) {
        return (a.date > b.date ? 1 : -1)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0px;
  padding: 0px;
}

h1 {
  color: #005ab3;
  font-size: 60px;
  display: inline;
}

.submenu {
  margin-bottom: 30px;
  margin-top: 20px;
  margin-left: 100px;
}

.no {
  width: 100px;
}

.messe1 {
  width: 200px;
}

select {
  display: block;
}

.btn {
  margin-right: 100px;
  font-size: 20px;
}

.userselect{
  margin-bottom: 5px;
}
.channel {
  margin-bottom: 5px;
}

.pull {
  display: inline-block;
  margin-left: 5px;
  height: 20px;
  margin-right: 500px;
}

.colors {
  opacity: 0.3;
  color: red;
}

.pulla {
  display: inline-block;
  font-size: 20px;
}

input {
  display: inline;
}

input.sousin {
  margin-top: 5px;
  font-size: 20px;
  margin-right: 100px;
  display: inline-block;
  max-width: 180px;
  text-align: left;
  border: 2px solid #9ec34b;
  font-size: 17px;
  color: #005ab3;
  text-decoration: none;
  font-weight: bold;
  padding: 0px 20px;
  border-radius: 4px;
  transition: .4s;
}

input.sousin:hover {
  background-color: #005ab3;
  border-color: #cbe585;
  color: #FFF;
}

.serch {
  height: 20px;
  width: 200px;

}

.ts {
  padding-left: 40px;
}

.ts:hover {
  cursor: pointer;
  color: rgb(157, 182, 203);
}

table {
  border-collapse: collapse;
  margin: 0;
  table-layout: fixed;
  width: 100%;
}

td,
th {
  padding: 10px;
}

td {
  word-wrap: break-word;
}

th {
  color: #fff;
  background: #005ab3;
}

table li {
  list-style: none;
}

td.text {
  width: 45%;
}

th.messe {
  width: 45%;
}

th.name {
  width: 15%;
}

td.name {
  width: 15%;
}

th.ts {
  width: 30%;
}

td.ts {
  width: 30%;
}

td.reactions {
  width: 10%;
}

th.reactions {
  width: 10%;
}

.r {
  width: 30px;
}

.reaction li {
  margin-top: 0px;
  padding-top: 0px;
  height: 24px;
}

.noResult{
  font-size: 20px;
  color:red;
}

[v-cloak] {
  display: none;
}
@media screen and (max-width: 896px) and (orientation: landscape){
  .secch{
    text-align: center;
    margin-right:50px;
  }
}
</style>
