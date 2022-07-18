import Vue from 'vue'
import App from './App.vue'
import helpers from './helpers'

new Vue({
  el: 'body',
  components: { App }
});

// 이동여부
const ua = window.navigator.userAgent;
window.isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Mobile|UCWeb/i.test(ua)
  ? true
  : false;

// vue-memo 요소 제한
if (window.isMobile) {
  ('#vue-memo')
    .height(window.innerHeight - 60)
    .css('overflow', 'scroll');
}

// 브라우저에 응답하기 위해 모든 memo 크기 조정
(window).on('resize', () => {
  helpers.resizeMemos();
});

// 작은 시각적 효과
('body').on('mousemove', (evt) => {
  ('body')
    .css('background-position-x', Math.ceil(evt.pageX / 40))
    .css('background-position-y', Math.ceil(evt.pageY / 40));
});
window.ondeviceorientation = (evt) => {
  ('body')
    .css('background-position-x', evt.gamma)
    .css('background-position-y', evt.beta);
};
