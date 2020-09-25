const fs = require('fs-extra');
const config = require('../../config');
const path = require('path');
const sizeOf = require('image-size');
const stringifyAttributes = require('stringify-attributes');
const globParent = require('glob-parent');
const sharp = require('sharp');
const imagemin = require('imagemin');
const mozJpegPlugin = require('imagemin-mozjpeg');
const gifLossyPlugin = require('imagemin-giflossy');
const pngquantPlugin = require('imagemin-pngquant');
const svgoPlugin = require('imagemin-svgo');
const webpPlugin = require('imagemin-webp');

const sourcePath = globParent(config.images.source);
const buildPath = config.images.build;
const relativePath = path.relative(config.paths.build, config.images.build);

const processImage = (source, image) => {
  let match = /\S+@(\d+)\.\w+/.exec(image);
  let width, file = image;

  if(match) {
    width = parseInt(match[1]);
    image = match[0];
  }

  const dist = path.join(config.paths.build, image);
  if(!fs.existsSync(dist)) {
    let processor = sharp(source);
    if(width) {
      processor.resize(width);
    }

    processor.toBuffer().then(data => {
      imagemin.buffer(data, config.images.build, {
        plugins: [
          mozJpegPlugin({ progressive: true }),
          pngquantPlugin(),
          gifLossyPlugin(),
          webpPlugin(),
          svgoPlugin({
            plugins: [
              {
                removeViewBox: true
              }
            ]
          })
        ]
      }).then(data => {
        fs.ensureFileSync(dist);
        fs.writeFileSync(dist, data);
      });
    });
  }
}

const parseSizes = (sizes) => {
  if(sizes) {
    sizes = sizes.split(',');
  } else {
    sizes = [];
  }

  let sizeMap = [];
  let screenMap = [];
  let maxSize = null;

  sizes.forEach(function(size) {
    size = size.trim();

    if(/^\d+$/.test(size)) {
      sizeMap.push({
        width: parseInt(size, 10),
        density: `${size}w`
      });
    } else if(/^\d+\s+[a-z]+$/.test(size)) {
      const found = size.match(/^(\d+)\s+([a-z]+)$/);
      let screen = found[2];
      let density = found[2];

      if(config.breakpoints.hasOwnProperty(screen)){
        screenMap.push({
          width: parseInt(found[1], 10),
          screen: config.breakpoints[screen]
        });
      }
    } else if(/^\d+\s+\d+$/.test(size)) {
      const found = size.match(/^(\d+)\s+(\d+)$/);

      sizeMap.push({
        width: parseInt(found[1], 10),
        density: `${found[2]}w`
      });
    } else if(/^\d+\s+\d+w$/.test(size)) {
      const found = size.match(/^(\d+)\s+(\d+w)$/);

      sizeMap.push({
        width: parseInt(found[1], 10),
        density: found[2]
      });
    }
  });

  sizeMap.sort(function(a, b) {
    return a.width - b.width;
  });
  screenMap.sort(function(a, b) {
    return a.screen - b.screen;
  });

  if(screenMap.length > 0) {
    maxSize = screenMap[screenMap.length - 1].width;
  } else if(sizeMap.length > 0) {
    maxSize = sizeMap[sizeMap.length - 1].width;
  }

  return {
    sizeMap: sizeMap,
    screenMap: screenMap,
    maxSize: maxSize
  }
}

const generateSrcset = (basepath, sizeMap, ext) => {
  return sizeMap.map(item => {
    return `${relativePath}/${basepath}@${item.width}${ext} ${item.density}`;
  }).join(', ');
}

const generatePicture = (src, size, sizes, webp, placeholder, attributes) => {
  const source = path.join(sourcePath, src);
  const {ext, dir, name, base} = path.parse(src);

  let basepath = name;
  if(dir) {
    basepath = `${dir}/${name}`;
  }

  const generateImgTag = (src, attributes) => {
    processImage(source, src);
    return `<img data-src="${src}"${stringifyAttributes(attributes)} />`;
  }

  const generateSourceTag = (srcset, type, media) => {
    let images = srcset.split(',');
    images.forEach((image) => {
      processImage(source, image);
    });

    let output = '<source ';

    if(media) {
      output += `media="${media}" `;
    }

    if(type) {
      output += `type="${type}" `;
    }

    return output + `data-srcset="${srcset}" />`;
  }

  const generateScreenSourceTags = (basepath, screenMap, ext, webp = false) => {
    return screenMap.map((item, index) => {
      let output, media, type;

      if(index === 0 && screenMap.length === 1) {
        media = `(min-width: ${next}px)`;
      } else if(index < screenMap.length - 1){
        let next = screenMap[index+1].screen - 1;
        if(item.screen == 0) {
          media = `(max-width: ${next}px)`;
        } else {
          media = `(min-width: ${item.screen}px) and (max-width: ${next}px)`;
        }
      } else {
        media = `(min-width: ${item.screen}px)`;
      }

      if(webp) {
        type = "image/webp";
      }

      return generateSourceTag(`${relativePath}/${basepath}@${item.width*2}${ext} 2x, ${relativePath}/${basepath}@${item.width}${ext} 1x`, type, media);
    }).join('');
  }

  const {screenMap, sizeMap, maxSize} = parseSizes(sizes);

  if(!size) {
    size = maxSize;
  }

  let output = '';

  if(fs.existsSync(source)) {
    if(placeholder !== 'false') {
      output = `<div class="${placeholder}"`;
      const dimensions = sizeOf(source);
      const padding = 100*(dimensions.height/dimensions.width);

      output += ` style="padding-bottom: ${padding.toFixed(3)}%">`;
    }
    output += '<picture>';

    if(webp === 'true' || webp === true) {
      output += generateScreenSourceTags(basepath, screenMap, '.webp', true);

      if(sizeMap.length > 0) {
        output += generateSourceTag(generateSrcset(basepath, sizeMap, '.webp'), 'image/webp');
      }

      if(size !== null) {
        output += generateSourceTag(`${relativePath}/${basepath}@${size}.webp`, 'image/webp');
      } else {
        output += generateSourceTag(`${relativePath}/${basepath}.webp`, 'image/webp');
      }
    }

    output += generateScreenSourceTags(basepath, screenMap, ext);

    if(sizeMap.length > 0) {
      output += generateSourceTag(generateSrcset(basepath, sizeMap, ext));
    }

    if(size) {
      output += generateImgTag(`${relativePath}/${basepath}@${size}${ext}`, attributes);
    } else {
      output += generateImgTag(`${relativePath}/${src}`, attributes);
    }

    output += '</picture>';

    if(placeholder !== 'false') {
      output += '</div>';
    }
  } else {
    output = generateImgTag(`${relativePath}/${src}`, attributes);
  }

  return output;
}

const generateSizesFromScreen = (screenMap) => {
  return screenMap.map((item, index) => {
    let output, media, type;

    if(index === 0 && screenMap.length === 1) {
      media = `(min-width: ${next}px)`;
    } else if(index < screenMap.length - 1){
      let next = screenMap[index+1].screen - 1;
      if(item.screen == 0) {
        media = `(max-width: ${next}px)`;
      } else {
        media = `(min-width: ${item.screen}px) and (max-width: ${next}px)`;
      }
    } else {
      media = `(min-width: ${item.screen}px)`;
    }

    return `${media} ${item.width}px`;
  }).join(', ');
}

const generateImage = (src, size, sizes, placeholder, attributes) => {
  const source = path.join(sourcePath, src);
  const {ext, dir, name, base} = path.parse(src);

  let basepath = name;
  if(dir) {
    basepath = `${dir}/${name}`;
  }

  let {screenMap, sizeMap, maxSize} = parseSizes(sizes);

  screenMap.forEach((item) => {
    sizeMap.push({
      width: item.width,
      density: `${item.width}w`
    });
  });

  sizeMap.sort(function(a, b) {
    return a.width - b.width;
  });

  if(!size) {
    size = maxSize;
  }

  let output = '';

  if(fs.existsSync(source)) {
    if(placeholder !== 'false') {
      output = `<div class="${placeholder}"`;
      const dimensions = sizeOf(source);
      const padding = 100*(dimensions.height/dimensions.width);

      output += ` style="padding-bottom: ${padding.toFixed(3)}%">`;
    }
    output += '<img';

    if(sizeMap.length > 0) {
      let srcset = generateSrcset(basepath, sizeMap, ext);
      let images = srcset.split(',');
      images.forEach((image) => {
        processImage(source, image);
      });
      output += ` data-srcset="${srcset}"`
    }
    if(size) {
      processImage(source, `${relativePath}/${basepath}@${size}${ext}`);
      output += ` data-src="${relativePath}/${basepath}@${size}${ext}"`;
    } else {
      processImage(source, `${relativePath}/${src}`);
      output += ` data-src="${relativePath}/${src}"`;
    }
    if(screenMap.length > 0) {
      output += ` sizes="${generateSizesFromScreen(screenMap)}"`;
    }

    output += ` ${stringifyAttributes(attributes)} />`;

    if(placeholder !== 'false') {
      output += '</div>';
    }
  }

  return output;
}

module.exports.register = function (Handlebars) {
  /**
   * {{ picture "test.png" placeholder="image" size="640" sizes="640 xs, 960 md" class="lazy" alt="Test image" }}
   * {{ picture "test.png" placeholder="image" size="640" sizes="640, 960" class="lazy" alt="Test image" }}
   * {{ picture "test.png" placeholder="image" size="640" sizes="640 640w, 960 960w" class="lazy" alt="Test image" }}
   **/
  Handlebars.registerHelper("picture", function(src, options) {
    const {webp = true, size = null, sizes = null, placeholder = 'image', ...attributes} = options.hash || {};

    const output = generatePicture(src, size, sizes, webp, placeholder, attributes);
    return new Handlebars.SafeString(output);
  });

  /**
   * {{ image "test.png" placeholder="image" sizes="640 xs, 960 md" class="lazy" alt="Test image" }}
   * {{ image "test.png" placeholder="image" size="640" sizes="640, 960" class="lazy" alt="Test image" }}
   * {{ image "test.png" placeholder="image" size="640" sizes="640 640w, 960 960w" class="lazy" alt="Test image" }}
   **/
  Handlebars.registerHelper("image", function(src, options) {
    const {size = null, sizes = null, placeholder = 'image', ...attributes} = options.hash || {};

    const output = generateImage(src, size, sizes, placeholder, attributes);
    return new Handlebars.SafeString(output);
  });
};
