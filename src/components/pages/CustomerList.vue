<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <!-- 列表 -->
    <div class="row mt-4">
      <div class="col-md-3 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 350px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}"
            >
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">原價 {{item.origin_price}} 元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProductItem(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.OneUploading === item.id"></i>
              查看更多
            </button>
            <!-- <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
              <i class="fas fa-spinner fa-spin" v-if="status.OneUploading === item.id"></i>
              加到購物車
            </button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 end -->
    <!-- 分頁 -->
    <!-- <nav aria-label="Page navigation example">
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
    </nav> -->
    <!-- 分頁 end -->
    <!-- Modal -->
    <div id="oneModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ tempProduct.category }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
            <h3>{{ tempProduct.title }}</h3>
            <p>{{ tempProduct.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!tempProduct.price">原價 {{tempProduct.origin_price}} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{tempProduct.origin_price}} 元</del>
              <div class="h5" v-if="tempProduct.price">現在只要 {{tempProduct.price}} 元</div>
            </div>
            <!-- <select class="form-control mt-1" id="exampleFormControlSelect2" v-model="tempProduct.num">
              <option v-for="num in 10">選購 {{num}} 件</option>
            </select> -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- Modal end -->
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data(){
    return {
      products: [], //產品列表
      tempProduct: {}, //佔存產品
      // pagination:{}, //分頁
      // isNew: false, //判斷新增(true)還是修改(false)
      // isLoading: false, //loading狀態
      status:{
        OneUploading: '', //點開單一產品狀態
      }
    }
  },
  methods:{
    getProducts(page = 1){// 商品列表
      const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      const vm = this;
      vm.isLoading = true;//loading圖片顯示
      this.$http.get(api).then((response) => {
        console.log(response.data);
        vm.products = response.data.products;
        vm.isLoading = false;//loading圖片隱藏
      })
    },
    getProductItem(item){// 單一商品
      const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${item}`;
      const vm = this;
      vm.status.OneUploading = item;//取得loading圖片id
      this.$http.get(api).then((response) => {
        vm.tempProduct = response.data.product;
        $('#oneModal').modal('show');
        vm.status.OneUploading = '';//loading圖片id清空
      })
    },
  },
  created () {// 一進來執行商品列表
    this.getProducts();
  }
};
</script>
