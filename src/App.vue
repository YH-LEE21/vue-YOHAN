<template>
  <div id="vue-memo">

    <!--  도구집  -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand">vue-YOHAN</a>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse" aria-expanded="false">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse navbar-right">
          <ul class="nav navbar-nav">

            <!--  글/그림 작성  -->
            <li class="add dropdown">
              <a class="create-new dropdown-toggle" data-toggle="dropdown">작성</a>
              <ul class="dropdown-menu">
                <li @click="createMarkdown">
                  <a>글</a>
                </li>
                <li @click="createDoodle">
                  <a>그림</a>
                </li>
              </ul>
            </li>
            <!--  -->

            <!--  카테고리  -->
            <li class="categories dropdown">
              <a class="current-category dropdown-toggle" data-toggle="dropdown">
                {{ categories[currentCategoryId] }}
                <span class="count badge">{{ memosFiltered.length }}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="total" @click="filterBy(0, queryString)">
                  <a>
                    전부
                    <span class="count badge">{{ memos.length }}</span>
                  </a>
                </li>
                <li class="divider"></li>
                <li @click="filterBy(1, queryString)">
                  <a>
                    일
                    <span class="count badge">{{ memosInWorkCate.length }}</span>
                  </a>
                </li>
                <li @click="filterBy(2, queryString)">
                  <a>
                    일상
                    <span class="count badge">{{ memosInLivingCate.length }}</span>
                  </a>
                </li>
                <li @click="filterBy(3, queryString)">
                  <a>
                    공부
                    <span class="count badge">{{ memosInStudyCate.length }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <!--  -->

            <!--  카테고리 정렬  -->
            <li class="sort-by dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown">
                {{ currentSortBy }}
              </a>
              <ul class="dropdown-menu">
                <li @click="sortByTimeOrTitle('title')">
                  <a>제목 순</a>
                </li>
                <li @click="sortByTimeOrTitle('timeStamp')">
                  <a>생성시간</a>
                </li>
              </ul>
            </li>
            <!--  -->

            <!--  검색  -->
            <li>
              <input
                type="text"
                class="search-box form-control"
                placeholder="제목, 내용, 생성 시간"
                v-model="queryString"
                @keyup="filterBy(currentCategoryId, queryString)">
            </li>
            <!--  -->

          </ul>
        </div>
      </div>
    </nav>

    <!--  memos  -->
    <div id="memos" class="container">
      <memo-item v-for="memo in memosFiltered" :memo="memo"></memo-item>

    </div>

    <memo-editor></memo-editor>

  </div>
</template>

<script>
import helpers from './helpers';
import storeUtil from './storage';
import memoItem from './components/memoItem.vue';
import memoEditor from './components/memoEditor.vue';


let store = storeUtil.store;
let Memo = storeUtil.Memo;

export default {
  data () {
    return {
      memos: store.memos,
      memosFiltered: [],
      currentSortBy: '',
      currentCategoryId: '',
      queryString: '',
      categories: {
        0: '전체',
        1: '일',
        2: '일상',
        3: '공부',
      },
      helpers,
    };
  },
  components: {
    memoItem,
    memoEditor,
  },
  methods: {
    // 필터
    filterBy (categoryId, queryString) {
      let result = [];
      // 먼저 [categoryid]로 거른다
      switch (categoryId) {
        case 0:
          result = this.memos;
          this.currentCategoryId = 0;
          break;
        case 1:
          result = this.memosInWorkCate;
          this.currentCategoryId = 1;
          break;
        case 2:
          result = this.memosInLivingCate;
          this.currentCategoryId = 2;
          break;
        case 3:
          result = this.memosInStudyCate;
          this.currentCategoryId = 3;
          break;
      }
      if (queryString !== '') {
        result = result.filter((item) => {
          let matchesQuery = false;
          // '제목' 또는 '날짜 문자열'에 쿼리 문자열이 포함되어 있으면
          if (item.title.indexOf(queryString) !== -1 || item.timeStamp.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          // '텍스트 형식 memo의 내용'에 쿼리 문자열을 포함
          if (item.type === 0 && item.content.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          
          return matchesQuery;
        });
      }
      this.memosFiltered = result;
      this.sortByTimeOrTitle('title');
    },
    // 정렬
    sortByTimeOrTitle (option) {
      this.memosFiltered.sort((m1, m2) => {
        if (m1[option] < m2[option]) {
          return -1;
        } else {
          return 1;
        }
      });
      this.currentSortBy =
        option === 'timeStamp'
        ? '생성 시간'
        : '제목 순';
    },
    // memoItem 구성 요소로부터 이벤트를 받아 memoEditor 구성 요소에게 보냄
    createMarkdown () {
      this.$broadcast('createMarkdown');
    },
    createDoodle () {
      this.$broadcast('createDoodle');
    },
  },
  computed: {
    memosInWorkCate () {
      return this.memos.filter((item) => {
        return item.categoryId === 1;
      });
    },
    memosInLivingCate () {
      return this.memos.filter((item) => {
        return item.categoryId === 2;
      });
    },
    memosInStudyCate () {
      return this.memos.filter((item) => {
        return item.categoryId === 3;
      });
    },
  },
  events: {
    editMarkdown (memo) {
      this.$broadcast('editMarkdown', memo);
    },
    editDoodle (memo) {
      this.$broadcast('editDoodle', memo);
    },
  },
  // 주기
  ready () {
    this.filterBy(0, this.queryString);
    this.sortByTimeOrTitle('title');
  },
  watch: {
    memosFiltered () {
      helpers.resizeMemos();
    }
  }
};
</script>

<style lang="stylus">
@import './style/main'
</style>
