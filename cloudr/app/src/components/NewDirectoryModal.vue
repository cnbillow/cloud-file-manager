<template>
    <div class="modal fade" id="new-directory" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>添加目录</h5>
                </div>
                <div class="modal-body">
                    <form class="input-group" id="new-directory-form">
                        <div class="input-group-append">
                            <span class="input-group-text">目录名称：</span>
                        </div>
                        <input type="text" id="new-dir-name" class="form-control" name="dirName">
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="new-directory-button" v-on:click="newDirectory">确定</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import { Messager } from '../lib/notification'

export default {
    methods: {
        async newDirectory(event) {
            let inputDirName = document.getElementById("new-dir-name")
            let dirName = inputDirName.value
            let path = this.$store.state.path
            if (!dirName) {
                return
            }
            try {
                await this.$store.dispatch("newDirectory", { dirName, path })
            }
            catch (e) {
                new Messager(Messager.LEVEL.INFO, '创建文件夹失败！').publishMessage()
            }
            $("#new-directory").modal("hide")
        }
    },
    props: ['show'],
    watch: {
        show: function(newShow, old) {
            if (newShow) {
                $("#new-directory").modal("show")
            }
        }
    },
    mounted: function() {
        $("#new-directory").on('hide.bs.modal', (e) => {
            this.$emit('update:show', false)
        })
    }
}
</script>
