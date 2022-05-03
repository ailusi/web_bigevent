$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    //补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据时，发送到服务器
    let q = {
        pagenum: 1,
        pagesize: 3,
        cate_id: '',
        state: ''
    }


    initTable()
    initCate()
    //获取文章列表数据方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                //模板引擎渲染
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染表单区域ui结构
                form.render()
            }
        });
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val();
        //给查询参数q对应属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //分页
    function renderPage(total) {

        //执行一个laypage实例
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示的数据
            curr: q.pagenum,//默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [5, 8, 12, 14],
            //分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                //first判断通过哪种方式触发的jump
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //根据最新的q获取对应列表，并渲染表格
                if (!first) {
                    initTable()
                }

            }
        })
    }

    //代理，删除点击
    $('tbody').on('click', '.del', function () {

        let len = $('.del').length
      
        let id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除成功')
                    //数据删除后判断是否还有剩余数据
                    if (len === 1) {
                        //页码最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        })
    })

  
})