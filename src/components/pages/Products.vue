<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)">建立新產品</button>
    </div>
    <!-- 列表 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="80">原價</th>
          <th width="80">售價</th>
          <th width="120">是否啟用</th>
          <th width="150">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,key) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm ml-2" @click="openDelModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 列表 end -->
    <!-- 分頁 -->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" 
          v-for="page in pagination.total_pages"
          :class="{'active' : pagination.current_page === page}" 
          :key="page">
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled' : !pagination.has_next}">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- 分頁 end -->
    <!-- Modal -->
    <!-- 新增修改modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" @change="uploadFile"
                    ref="files">
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" v-model="tempProduct.title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" v-model="tempProduct.category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" v-model="tempProduct.price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" 
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                      id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增修改modal end -->
    <!-- 刪除modal -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delModal()"
              >確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除modal end -->
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data(){
    return {
      products: [], //產品列表
      tempProduct: {}, //佔存產品
      pagination:{}, //分頁
      isNew: false, //判斷新增(true)還是修改(false)
      isLoading: false, //loading狀態
      status:{
        fileUploading: false, //上傳loading狀態
      }
    }
  },
  methods:{
    getProducts(page = 1){// 商品列表
      const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;//loading圖片顯示
      this.$http.get(api).then((response) => {
        console.log(response.data);
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;//loading圖片隱藏
      })
    },
    openModal(isNew,item){// 開啟新增修改Modal
      // 判斷是新增還是修改
      if(isNew){
        this.tempProduct = {};
        this.isNew = true;
      }else{
        this.tempProduct = {...item};
        this.isNew = false;
      }
      $('#productModal').modal('show');
    },
    updateProduct(){// 新增修改
      let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      let httpMethod = 'post';
      const vm = this;
      // 判斷如果是false，就是商品修改
      if(!this.isNew){
        api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, {data: vm.tempProduct}).then((response) => {
        if(response.data.success){
          $('#productModal').modal('hide');
          vm.getProducts();
          vm.$bus.$emit('messsage:push',response.data.message,'success');
        }else{
          $('#productModal').modal('hide');
          vm.getProducts();
          vm.$bus.$emit('messsage:push',response.data.message,'danger');
        }
      })
    },
    openDelModal(item){// 開啟刪除Modal
      this.tempProduct = {...item};
      $('#delProductModal').modal('show');
    },
    delModal(){// 刪除
      const vm = this;
      const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then((response) => {
        if(response.data.success){
          vm.getProducts();
          $('#delProductModal').modal('hide');
          vm.$bus.$emit('messsage:push',response.data.message,'success');
        }
      })
    },
    uploadFile(){ //上傳圖片
      const imgurl= this.$refs.files.files[0];
      const vm = this;
      vm.status.fileUploading = true;//loading圖片顯示
      const formData = new FormData();
      formData.append('file-to-upload',imgurl);
      const url=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      this.$http.post(url,formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) =>{
        vm.status.fileUploading = false;//loading圖片隱藏
        if(response.data.success){
          vm.$set(vm.tempProduct,'imageUrl',response.data.imageUrl);
        }else{
          // console.log(response.data);
          vm.$bus.$emit('messsage:push',response.data.message,'danger');
        }
      })      
    }
  },
  created () {// 一進來執行商品列表
    this.getProducts();
  }
};
</script>
