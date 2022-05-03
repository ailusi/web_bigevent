$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    //获取文章分类
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
    $('#btnAddCate').click(function (e) {
        e.preventDefault();
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        })
    })
    //通过代理为表单绑定事件
    $('body').on('submit', '#dialog-form', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return console.log(res.messgame);
                }
                initArtCateList()
                layer.msg('新增文章分类成功')
                layer.close(indexAdd)
            }
        })


    })

    let indexEdit = null
    //通过代理为按钮绑定事件
    $("tbody").on('click', '#edit', function () {
        indexEdit = layer.open({
            title: '编辑',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        })

        let id = $(this).attr('data-id')
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书数据失败')
                }
                layer.msg('获取图书成功')
                form.val('dialog-edit', res.data)
            }
        });
    })

    //代理，修改分类绑定submit事件
    $('body').on('submit', '#dialog-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //代理，删除按钮
   
    $('tbody').on('click', '#del', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确定删除文章分类？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章成功')
                    layer.close(index)
                    initArtCateList()
                }
            })


        });
    })
})