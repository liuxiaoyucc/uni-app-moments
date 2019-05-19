/**
 * 使用plus.zip.compressImage压缩,目前仅支持App端
 */


let images = [];//压缩后的图片集合
let max_width = 500;//若宽度大于此尺寸,触发压缩,否则使用原图,可自行修改

/**
 * 接收图片集合
 */
async function compress(_images, _fun) {
	for (let i = 0; i < _images.length; i++) {//循环单张压缩
		var compressd_image = await _compress(_images[i])
		images.push(compressd_image);
	}
	_fun && _fun(images);
	images = [];//压缩结束重置images,准备下次压缩
}

/**
 * 菜鸟请大神教我如何优化QAQ~
 */
async function _compress(_image) {

	var last4chars = _image.slice(-4);
	if (plus.os.name == 'Android') { //安卓下plus.zip.compressImage只支持jpeg/jpg/png
		if (!~last4chars.indexOf('jpg') && !~last4chars.indexOf('png') && !~last4chars.indexOf('jpeg')) {
			return _image;
		}
	}

	var image_info = await get_image_info(_image);
	if (image_info.width < max_width) { //小于800不压缩
		return _image;
	}

	return new Promise((resolve, reject) => {
		plus.zip.compressImage({
				src: _image,//原始图片的路径
				dst: _image,//压缩转换目标图片的路径(为了省事这里使用原路径)
				overwrite: true,//使用原文件名并覆盖,如果想将原文件保留,并和压缩后图片同时上传,需要改为false,并修改dst
				quality: 100,//1-100,压缩后质量,越低图片占用空间越小,越模糊
				width: max_width+'px',//这里先写死800;height默认为auto,即根据width与源图宽的缩放比例计算
			},
			(res) => {
				resolve(res.target)
			},
			(e) => {
				reject(e);
			}
		)

	})


}

function get_image_info(_image) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: _image,
			success: res => {
				resolve(res);
			}
		})
	})
}

export default {
	compress
}
