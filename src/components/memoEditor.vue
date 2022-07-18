<template>
  <div>

    <div id="new-markdown" class="editor-layer">
      <div class="editor-top">
        <input class="editor-title form-control" type="text" placeholder="제목"
          v-model="newMarkdown.title">
        <div class="dropdown select-category">
          <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            <span class="category">{{ categories[newMarkdown.categoryId] }}</span>
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li @click="newMarkdown.categoryId = 1"><a>직장</a></li>
            <li @click="newMarkdown.categoryId = 2"><a>일상</a></li>
            <li @click="newMarkdown.categoryId = 3"><a>공부</a></li>
          </ul>
        </div>
        <ul class="tools">
          <li class="save" @click="saveNewMarkdown"></li>
          <li class="cancel" @click="hideAllEditorLayers"></li>
        </ul>
      </div>
      <textarea class="text-content form-control" placeholder="내용"
        v-model="newMarkdown.content">
      </textarea>
    </div>


    <div id="new-doodle" class="editor-layer">
      <div class="editor-top">
        <input class="editor-title form-control" type="text" placeholder="제목"
          v-model="newDoodle.title">
        <div class="dropdown select-category">
          <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            <span class="category">{{ categories[newDoodle.categoryId] }}</span>
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li @click="newDoodle.categoryId = 1"><a>직장</a></li>
            <li @click="newDoodle.categoryId = 2"><a>일상</a></li>
            <li @click="newDoodle.categoryId = 3"><a>공부</a></li>
          </ul>
        </div>
        <ul class="tools">
          <li class="save" @click="saveNewDoodle"></li>
          <li class="cancel" @click="closeDoodleEditor"></li>
        </ul>
      </div>
      <div class="canvas-wrapper">
        <ul class="doodle-colors">
          <li data-color="black"></li>
          <li data-color="green"></li>
          <li data-color="yellow"></li>
          <li data-color="red"></li>
          <li data-color="white"></li>
        </ul>
        <ul class="doodle-controllers">
          <li class="undo"></li>
          <li class="redo"></li>
          <li class="clear"></li>
        </ul>
        <canvas class="doodle-content" width='260' height='260'></canvas>
      </div>
    </div>

    <div id="edit-markdown" class="editor-layer">
      <div class="editor-top">
        <input class="editor-title form-control" type="text" placeholder="제목">
        <ul class="tools">
          <li class="save" @click="saveExistingMarkdown"></li>
          <li class="cancel" @click="hideAllEditorLayers"></li>
        </ul>
      </div>
      <textarea class="text-content form-control" placeholder="내용"></textarea>
    </div>

    <div id="edit-doodle" class="editor-layer">
      <div class="editor-top">
        <input class="editor-title form-control" type="text" placeholder="제목">
        <ul class="tools">
          <li class="save" @click="saveExistingDoodle"></li>
          <li class="cancel" @click="hideAllEditorLayers"></li>
        </ul>
      </div>
      <div class="canvas-wrapper">
        <ul class="doodle-colors">
          <li data-color="black"></li>
          <li data-color="green"></li>
          <li data-color="yellow"></li>
          <li data-color="red"></li>
          <li data-color="white"></li>
        </ul>
        <ul class="doodle-controllers">
          <li class="undo"></li>
          <li class="redo"></li>
          <li class="clear"></li>
        </ul>
        <canvas class="doodle-content" width='260' height='260'></canvas>
      </div>
    </div>

  </div>
</template>

<script>
import helpers from '../helpers';
import storeUtil from '../storage';
import $ from 'jquery'

let store = storeUtil.store;
let Memo = storeUtil.Memo;

export default {
  data () {
    return {
      helpers,
      categories: {
        1: '일',
        2: '일상',
        3: '공부',
      },
      // 새로 추가 markdown memo
      newMarkdown: new Memo({
        categoryId: 1,
        title: '',
        type: 0,
        content: '',
      }),
      // 새로 추가 doodle memo
      newDoodle: new Memo({
        categoryId: 1,
        title: '',
        type: 1,
        content: '',
      }),
      // 편집된 memo 개체
      memoToEdit: null,
    };
  },
  methods: {
    //메모 저장
    saveNewMarkdown () {
      let $markdownEditor = $('#new-markdown');
      store.add(new Memo({
        categoryId: this.newMarkdown.categoryId,
        title: this.newMarkdown.title,
        type: 0,
        content: this.newMarkdown.content,
      }));
      store.saveToLocalStorage();
      this.newMarkdown.content = this.newMarkdown.title = '';
      this.hideAllEditorLayers();
    },
    //그림 저장
    saveNewDoodle () {
      let canvasEle = $('#new-doodle .doodle-content')[0];
      this.newDoodle.content = canvasEle.toDataURL();
      store.add(new Memo({
        categoryId: this.newDoodle.categoryId,
        title: this.newDoodle.title,
        type: 1,
        content: this.newDoodle.content,
      }));
      store.saveToLocalStorage();
      this.newDoodle.content = this.newDoodle.title = '';
      this.hideAllEditorLayers();
    },
    // 편집
    saveExistingMarkdown () {
      let $markdownEditor = $('#edit-markdown');
      let newTitle = $markdownEditor.find('.editor-title').val();
      let newContent = $markdownEditor.find('.text-content').val();
      let agentMemo = new Memo({
        categoryId: this.memoToEdit.categoryId,
        title: newTitle,
        type: 0,
        content: newContent,
        timeStamp: this.memoToEdit.timeStamp,
        isCompleted: this.memoToEdit.isCompleted,
      });
      store.update(this.memoToEdit, agentMemo);
      store.saveToLocalStorage();
      this.hideAllEditorLayers();
    },
    //그림 편집
    saveExistingDoodle () {
      let $markdownEditor = $('#edit-doodle');
      let newTitle = $markdownEditor.find('.editor-title').val();
      let newContent = $markdownEditor.find('.doodle-content')[0].toDataURL();
      let agentMemo = new Memo({
        categoryId: this.memoToEdit.categoryId,
        title: newTitle,
        type: 1,
        content: newContent,
        timeStamp: this.memoToEdit.timeStamp,
        isCompleted: this.memoToEdit.isCompleted,
      });
      store.update(this.memoToEdit, agentMemo);
      store.saveToLocalStorage();
      this.hideAllEditorLayers();
    },
    // 닫기 버튼
    hideAllEditorLayers () {
      helpers.hideEditorLayer($('.editor-layer'));
    },
    // 닫을 때 새 markdown 내용이 vue에 의해 자동으로 동기화되므로 편집 창을 닫을 때 추가 작업이 필요하지 않습니다. 그러나 doodle은 자동으로 동기화되지 않습니다.
    closeDoodleEditor () {
      let canvasEle = $('#new-doodle .doodle-content')[0];
      this.newDoodle.content = canvasEle.toDataURL();
      this.hideAllEditorLayers();
    },
  },
  events: {
    createMarkdown () {
      helpers.showEditorLayer($('#new-markdown'));
    },
    createDoodle () {
      let $doodleEditor = $('#new-doodle');
      helpers.showEditorLayer($doodleEditor);
      // 캔버스 및 컨트롤러 배치 방법, 빈 캔버스 제공
      helpers.initCanvas(
        $doodleEditor.find('.doodle-content')[0],
        $doodleEditor.find('.doodle-colors')[0],
        $doodleEditor.find('.doodle-controllers')[0],
        null,
      );
    },
    editMarkdown (memo) {
      this.memoToEdit = memo;
      let $markdownEditor = $('#edit-markdown');
      $markdownEditor.find('.editor-title').val(memo.title);
      $markdownEditor.find('.text-content').html(memo.content);
      helpers.showEditorLayer($markdownEditor);
    },
    editDoodle (memo) {
      this.memoToEdit = memo;
      let $doodleEditor = $('#edit-doodle');
      $doodleEditor.find('.editor-title').val(memo.title);
      helpers.showEditorLayer($doodleEditor);
      // 캔버스 및 컨트롤러 배치 방법, 그래피티 불러오기 imageData
      helpers.initCanvas(
        $doodleEditor.find('.doodle-content')[0],
        $doodleEditor.find('.doodle-colors')[0],
        $doodleEditor.find('.doodle-controllers')[0],
        this.memoToEdit.content,
      );
    },
  },
}
</script>
