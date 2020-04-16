define(["../libs/vue"], function (Vue) {
  const template = `<div>
        <div>Main Section</div>
  </div>`;

  const app = Vue.component("app", {
    template: template,
  });
  return app;
});
