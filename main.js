import { imgbox } from 'imgbox-js'
import fs from 'fs'
import path from 'path'

const options = {
  content_type: 'adult',
  thumbnail_size: '800r',
  comments_enabled: false,
  logger: false,
}

function search_images(img_path = '.') {
  const results = []
  const files = fs.readdirSync(img_path)
  files.forEach((file) => {
    const fullpath = path.join(img_path, file)
    const stats = fs.statSync(fullpath)
    if (stats.isFile()) {
      if (/\.(jpg|png|jpeg|gif|bmp)$/i.test(file)) {
        results.push(fullpath)
      }
    }
  })
  return results
}

const template = '<img src=\'$url\' alt=\'alt\'>'

function print_image_tag(image_url, alt = '58cg.co') {
  console.log(template.replace('$url', image_url).replace('alt', alt))
}

function main() {
  const args = process.argv

  if (args.length < 3) {
    console.log('Usage: imgbox <input_dir>  ...')
    return
  }

  const inputDir = args[2]
  console.log('inputDir: ', inputDir)

  const images = search_images(inputDir)
  console.log('images: ', images)
  console.log(images)
  console.log('these images will be uploaded to imgbox...' +
    'Please wait. ', images)

  imgbox(images, options).then((res) => {
    if (!res.ok) {
      console.error(res.message)
    } else {
      for (const item of res.data.success) {
        print_image_tag(item.thumbnail_url)
      }
    }

  }, err => {
    console.error(err)
  })
}

main()
