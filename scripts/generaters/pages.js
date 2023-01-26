'use strict';

/**
 * @return Generate category、tags、404 index.html
 */
hexo.extend.generator.register('pages', function(locals){
  const config = hexo.config;

  return [
    {
      path: config.category_dir + '/index.html',
      data: {type: 'categories'},
      layout: ['page']
    },
    {
      path: config.tag_dir + '/index.html',
      data: {type: 'tags'},
      layout: ['page']
    },
    {
      path: '404.html',
      data: {type: '404'},
      layout: ['page']
    }
  ]
});
