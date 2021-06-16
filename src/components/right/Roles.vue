<template>
  <div>
    <!--  面包导航区域-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      添加角色-->
      <el-row>
        <el-col>
          <el-button type='primary'>添加角色</el-button>
        </el-col>
      </el-row>
      <!--      角色列表区域-->
      <el-table :data='rulesList' border stripe>
        <!--        展开列-->
        <el-table-column type='expand'>
          <template slot-scope='scope'>
            <el-row v-for='(item1,i1) in scope.row.children' :key='item1.id'
                    :class='["dbbottom",i1===0?"bdtop":"","vcenter"]'>
              <el-col :span='5'>
                <!--                一级权限-->
                <el-tag @close='removeRightById(scope.row,item1.id)' closable>{{ item1.authName }}</el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <el-col :span='19'>
                <!--                渲染二级和三级权限-->
                <el-row v-for='(item2,i2) in item1.children' :key='item2.id' :class='[i2!==0?"bdtop":"","vcenter"]'>
                  <!--                  通过for循环嵌套 渲染二级权限-->
                  <el-col :span='6'>
                    <el-tag type='success' @close='removeRightById(scope.row,item2.id)' closable>{{ item2.authName }}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag v-for='(item3) in item2.children' :key='item3.id' type='warning' closable
                            @close='removeRightById(scope.row,item3.id)'>{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type='index' label='#'>

        </el-table-column>
        <el-table-column label='角色名称' prop='roleName'>

        </el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'>

        </el-table-column>
        <el-table-column label='操作' width='300px'>
          <template slot-scope='scope'>
            <el-button type='primary' icon='el-icon-edit' @click='editRule(scope.row)' size='mini'>编辑</el-button>
            <el-button type='danger' icon='el-icon-delete' @click='deleteRule(scope.row)' size='mini'>删除</el-button>
            <el-button type='warning' icon='el-icon-setting' @click='settingRule(scope.row)' size='mini'>分配权限
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!--    分配权限的对话框-->
    <el-dialog
      title='分配权限'
      :visible.sync='setRightDialogVisible'
      width='50%'
      @close='setRightDialogClosed'>
      <!--      树型控件-->
      <el-tree :data='rightsList' :props='treeProps' show-checkbox @check-change='handleCheckChange' node-key='id'
               :default-expand-all='true'
               :default-checked-keys='defKeys'
               ref='treeRef'></el-tree>

      <span slot='footer' class='dialog-footer'>
    <el-button @click='setRightDialogVisible = false'>取 消</el-button>
    <el-button type='primary' @click='allotRights'>确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Roles',
  created () {
    this.getRuleList()
  },
  data () {
    return {
      rulesList: [],
      // 控制分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 分配权限所有数据
      rightsList: [],
      // 树型控件的数据绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    // 获取rule列表数据
    async getRuleList () {
      const { data: res } = await axios.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rulesList = res.data
    },
    // 编辑
    editRule (value) {

    },
    // 删除
    deleteRule (value) {

    },
    // 分配权限
    async settingRule (value) {
      // 获取所有权限的数据
      const { data: res } = await axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.roleId = value.id
      // 递归获取三级节点的id
      this.getLeafKeys(value, this.defKeys)
      this.setRightDialogVisible = true
      this.rightsList = res.data
      console.log(res)
    },
    // 根据id删除对应的权限
    async removeRightById (rule, id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除' + id)
      // 发起删除的请求
      const { data: res } = await axios.delete(`roles/${rule.id}/rights/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 局部更新数据  删除后
      rule.children = res.data
    },
    // 分配权限选中事件
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    // 通过递归获取角色下所有三级权限的id 并保存在数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果node的节点不包含children 则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭时间
    setRightDialogClosed () {
      // 清除原有数据
      this.defKeys = []
      this.roleId = ''
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 刷新权限列表
      await this.getRuleList()
      // 关闭当前对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.dbbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
