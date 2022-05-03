$(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()
    initEditor()
    //定义加载文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                let htmlStr = template('list', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染
                form.render()
            }
        })
    }

    let $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //给选择封面按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()

    })

    //监听图片选择change事件，获取用户选择
    $('#coverFile').on('change', function (e) {
        //获取文件的列表数组
        let files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择封面')
        }
        let newFileURL = URL.createObjectURL(files[0])

        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })
    //定义文章的发布状态
    let art_state = '已发布'

    $('#save2').click(function (e) {
        e.preventDefault();
        art_state = '草稿'
    })

    $('#form-pub').submit(function (e) {
        e.preventDefault();
        // 创建一个formdata对象
        let fd = new FormData($(this)[0])
        //把state属性添加到formdata
        fd.append('state', art_state)
        $image.cropper('getCroppedCanvas', {
            // 创建一个画布
            width: 400,
            height: 200
        }).toBlob(function (blob) { // 将裁剪图片变为文件blob后的回调函数
            fd.append('cover_img', blob)

           publishArticle(fd)
        })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            //向服务器提交formdata格式数据添加两个配置
            contentType:false,
            processData:false,
            success: function (res) {
                if(res.status!==0){
                    return layer.msg('发布文章失败')
                }      
              layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
   
})