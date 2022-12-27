/* global hexo */
// 严格模式
"use strict";
// 引入node模块
const path = require("path");
const url = require("url");
// const 用于声明一个或多个常量，声明时必须进行初始化，且初始化后值不可再修改
// (x) => x + 6
// function(x){
//   return x + 6;
// };
const fmtNum = (num) => {
  return num < 10 ? "0" + num : num;
};
// 修改局部变量
hexo.extend.filter.register("template_locals", (locals) => {
  const { env, config } = hexo;
  const { __, theme } = locals;
  const { i18n } = hexo.theme;

  var pangu = theme.pangu
    ? require("pangu")
    : {
        spacing: (data) => {
          return data;
        },
      };

  // Language & Config
  locals.alternate = theme.alternate;
  locals.title = pangu.spacing(
    __("title") !== "title" ? __("title") : config.title
  );
  locals.subtitle = pangu.spacing(
    __("subtitle") !== "subtitle" ? __("subtitle") : config.subtitle
  );
  locals.author = __("author") !== "author" ? __("author") : config.author;
  locals.description = pangu.spacing(
    __("description") !== "description" ? __("description") : config.description
  );
  locals.languages = [...i18n.languages];
  locals.languages.splice(locals.languages.indexOf("default"), 1);
  locals.page.lang = locals.page.lang || locals.page.language;
  locals.hostname = url.parse(config.url).hostname || config.url;

  // Creative Commons
  locals.ccURL =
    "https://creativecommons.org/" +
    (theme.creative_commons.license === "zero"
      ? "publicdomain/zero/1.0/"
      : "licenses/" + theme.creative_commons.license + "/4.0/") +
    (theme.creative_commons.language || "");

  if (locals.page.title) {
    locals.page.title = pangu.spacing(locals.page.title);
  }
  locals.page.lastcat = "";
  if (locals.page.categories) {
    locals.page.categories.map((cat) => {
      if (cat.name) {
        cat.name = locals.page.lastcat = pangu.spacing(cat.name);
      }
      return cat;
    });
  }

  if (locals.page.category) {
    locals.page.title = pangu.spacing(locals.page.category);
  }

  if (locals.page.month) {
    locals.page.month = fmtNum(locals.page.month);
  }
});
