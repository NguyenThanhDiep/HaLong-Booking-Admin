<template>
  <div class="position-relative h-100">
    <a href="javascript: void(0)" class="d-none" ref="btnScroll">
      <div class="toggle-btn">
        <div class="btn-scroll" @click="onScrollToTop">
          <i class="fas fa-angle-double-up text-white"></i>
        </div>
        <i class="fa fa-angle-up" aria-hidden="true"></i>
      </div>
    </a>
    <div
      id="orderListTable"
      class="content-table h-100"
      @scroll="onScroll"
      ref="tableContent"
    >
      <table class="order-list-table w-100" ref="order-list-table">
        <caption class="d-none"></caption>
        <thead>
          <tr ref="rowHeader" v-click-outside="onClickOutSiteHeader">
            <th v-show="isShowSelectCol">
              <div class="th-fixed">
                <b-form-checkbox
                  v-model="isSelectAll"
                  @change="onClickSelectAll"
                ></b-form-checkbox>
              </div>
            </th>
            <th
              scope="col"
              v-for="(field, index) in fields"
              :key="index"
              :class="[isShowFilterIcon(field.key) ? 'filtered' : '']"
            >
              <div class="hidden">
                <i
                  class="fa fa-filter filtered inactive-icons mr-2"
                  v-show="isShowFilterIcon(field)"
                ></i>
                {{ field.label }}
              </div>
              <div class="th-fixed" ref="header">
                <div
                  class="d-flex flex-grow-1 align-items-center h-100"
                  @click="onClickShowFilter(field.key + index)"
                >
                  <i class="fa fa-filter inactive-icons mr-2 d-none"></i>
                  <span class="label-header">{{ field.label }}</span>
                </div>
                <button
                  class="btn-sort h-100"
                  :id="`sorting_${field.key}_${index}`"
                  @click="sortTableByField(field)"
                >
                  <span v-show="field.sort == 'asc'">
                    <i class="fas fa-sort-up"></i>
                  </span>
                  <span v-show="field.sort == 'desc'">
                    <i class="fas fa-sort-down"></i>
                  </span>
                </button>
                <ul
                  :class="[
                    'filter-dropdown',
                    index == fields.length - 1 ? 'right' : '',
                  ]"
                  :id="field.key + index"
                  :ref="'filter-' + field.key"
                >
                  <li class="pt-2">
                    <template v-if="isDateColumn(field.key)">
                      <!-- <DateTimePicker
                        :id="field.key + '-' + index"
                        :ref="'inputDateTime-' + field.key + index"
                        @input="
                          (val) => {
                            onSearchOptionsByColumn(
                              { target: { value: val } },
                              field.key
                            );
                          }
                        "
                        autocomplete="off"
                      ></DateTimePicker> -->
                    </template>
                    <template v-else>
                      <b-form-input
                        type="text"
                        debounce="500"
                        :ref="'inputSearch-' + field.key + index"
                        @keyup="onSearchOptionsByColumn($event, field.key)"
                      ></b-form-input>
                    </template>
                  </li>
                  <li>
                    <b>Select {{ field.label }}</b>
                  </li>
                  <li class="px-0">
                    <div class="list-option">
                      <b-form-checkbox
                        v-for="(option, oIndex) in filteredFilters[field.key]"
                        class="d-flex ml-3"
                        v-model="option.checked"
                        :key="oIndex"
                        @change="onFilterByColumn(option)"
                      >
                        <div
                          class="d-flex justify-content-between align-content-between pr-2"
                        >
                          <span>{{ option.label }}</span>
                          <span> {{ option.count }} </span>
                        </div>
                      </b-form-checkbox>
                    </div>
                  </li>
                </ul>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="body-table">
          <tr v-if="loading">
            <td
              :colspan="fields.length + 1"
              class="text-primary font-weight-bold"
            >
              <div class="d-flex align-items-center justify-content-center">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && filteredItems.length == 0">
            <td
              :colspan="fields.length + 1"
              class="text-primary font-weight-bold"
            >
              <span>No matching any Bookings.</span>
            </td>
          </tr>
          <tr
            v-for="(item, index) in displayedItems"
            :key="index"
            @dblclick="onRowDbclick(item)"
            ref="tableRow"
          >
            <td v-show="isShowSelectCol">
              <div>
                <b-form-checkbox
                  v-model="item.isSelected"
                  @change="onSelectItem"
                ></b-form-checkbox>
              </div>
            </td>
            <td v-for="(field, index) in fields" :key="index">
              <template v-if="['price'].indexOf(field.key) >= 0">
                {{ parseInt(item[field.key]) }}
              </template>
              <template v-else-if="['isSale'].indexOf(field.key) >= 0">
                <b-form-checkbox
                  switch
                  v-model="item[field.key]"
                  disabled
                ></b-form-checkbox>
              </template>
              <template v-else-if="['star'].indexOf(field.key) >= 0">
                <i v-for="(s, indexS) in item[field.key]" class="fas fa-star yellow" :key="indexS"></i>
              </template>
              <template v-else>
                <div class="field-value">
                  {{ item[field.key] }}
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-list-table ::v-deep {
  font-size: 13px;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none;

  .yellow {
    color: #ffcc00;
  }

  thead {
    th {
      background-color: #121e39;
      color: #ffffff;
      font-size: 13px;
      margin: 0;
      font-weight: 500;
      width: auto;
      padding: 0.25rem 0.5rem;
      margin: 0 !important;
      min-width: 70px;

      .hidden {
        width: calc(100% - 32px);
        display: flex;
      }

      &.filtered {
        .th-fixed {
          .fa-filter {
            display: block !important;
          }
        }

        &.relaunched {
          .th-fixed {
            background-color: #6d768b !important;

            .label-header {
              flex: 1;
              text-align: center;
            }
          }
        }
      }
    }

    th.selected {
      background: #3a75c4 !important;

      & > div {
        background: #3a75c4 !important;
      }
    }

    .th-fixed {
      position: absolute;
      z-index: 90;
      display: flex;
      align-items: center;
      top: 0;
      background-color: #121e39;
      color: #ffffff;
      padding: 0 0.5rem;

      button {
        color: #ffffff;
      }

      &:hover {
        cursor: pointer;
        background: #ffffff;
        color: #000;
        transition: 0.3s;

        i {
          color: #000 !important;
        }

        button {
          color: #000;
        }
      }

      &.active {
        background: #ffffff !important;
        color: #000 !important;

        button {
          color: #000;

          i {
            color: #000;
          }
        }
      }
    }

    .filter-dropdown {
      color: black;
      list-style: none;
      top: 100%;
      padding: 0;
      -webkit-box-shadow: 5px 5px 5px #ccc;
      -moz-box-shadow: 5px 5px 5px #ccc;
      box-shadow: 5px 5px 5px #ccc;
      position: absolute;
      background-color: white;
      margin-left: -8px;
      width: max-content;
      text-align: left;
      min-width: 200px;
      display: none;

      &.show {
        display: block;
      }

      &.right {
        right: 0;
      }

      li {
        color: black;
        padding: 0.25rem 1rem;
        margin: 0;
      }

      .list-option {
        max-height: 320px;
        overflow: auto;

        .custom-control {
          align-items: center;

          .custom-control-label {
            width: 100%;

            &:before,
            &:after {
              top: 0;
            }
          }
        }
      }
    }
  }

  tbody {
    tr {
      background: #ffffff;
      border-top: 7px solid #ebedf0;
      border-bottom: 7px solid #ebedf0;

      td {
        padding: 0.25rem 0.5rem;
        position: relative;
        & > div.field-value {
          min-height: 44px;
          display: flex;
          align-items: center;
        }
      }

      &.table-active {
        background-color: rgba(0, 0, 0, 0.075);
      }
      &:hover {
        background-color: #d4ddf0;
        td {
          background-color: #d4ddf0;
        }
      }
    }
  }

  .fa-sort-down {
    margin-top: -4px;
  }

  .fa-sort-up {
    margin-top: 8px;
  }

  .btn-sort {
    background: transparent;
    border: 0;
    width: 32px;
    height: 32px;

    i {
      color: rgba(255, 255, 255, 0.25);
    }

    &:hover {
      i {
        color: #000 !important;
      }
    }

    i.active {
      color: #ffffff;
    }
  }

  th.col-checkbox {
    .custom-checkbox::v-deep {
      .custom-control-label {
        &:before,
        &:after {
          left: -10px;
        }
      }
    }
  }

  td.col-checkbox {
    min-width: 60px !important;
    width: 60px !important;

    .custom-checkbox::v-deep {
      .custom-control-label {
        &:before,
        &:after {
          left: -10px;
        }
      }
    }
  }
}

.toggle-btn {
  position: fixed;
  bottom: -8px;
  right: 0;
  & > i {
    font-size: 18px;
    position: fixed;
    right: 32px;
    bottom: -0px;
    &:hover {
      opacity: 0;
    }
  }
  .btn-scroll {
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    background-color: #121e39;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    opacity: 0;
    margin-right: 1rem;
    &:hover {
      background-color: #8c9aab;
    }
  }
  &:hover {
    //right: 1rem;
    padding-bottom: 1.5rem;
    z-index: 9999;
    & > i {
      opacity: 0;
    }
    animation: fadeBtnBackToTop 0.5s;
    .btn-scroll {
      opacity: 1;
      z-index: 9999;
    }
  }
}

@keyframes fadeBtnBackToTop {
  from {
    padding-bottom: 0;
  }
  to {
    padding-bottom: 1.5rem;
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import moment from "moment";
import $ from "jquery";

export default Vue.extend({
  name: "Table",
  props: {
    fields: {},
    items: {},
    loading: {},
    headerObject: {
      default: function () {
        return {
          sort: { label: "", key: "", sort: "" },
          filters: [],
          filteredCount: "",
          additionalFilters: [],
        };
      },
    },
    isShowSelectCol: {
      default: true,
    },
  },
  data() {
    return {
      displayedItem: 0,
      displayedItems: [],
      orderPaginate: [],
      btnScroll: null,
      optionsByFields: {},
      searchFilter: { key: "", value: "" },
      loadedItems: 1,
      isSelectAll: false,
    };
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    this.btnScroll = this.$refs.btnScroll;
    this.onChangeItems();
  },
  methods: {
    onSelectItem() {
      if (this.displayedItems.some((item) => !item.isSelected)) {
        this.isSelectAll = false;
      } else {
        this.isSelectAll = true;
      }
    },
    onClickSelectAll(val) {
      if (this.displayedItems.length > 0) {
        this.displayedItems.forEach((item) => {
          item.isSelected = val;
        });
      }
    },
    onChangeItems() {
      if (this.fields && this.fields.length) {
        this.fields.forEach((field) => {
          field.sort = "desc";
          this.getOptionsFilterByField(field);
        });
      }
      this.orderPaginate = [];
      this.displayedItems = [];
      this.paserOrderPaginate(this.filteredItems);
      this.btnScroll.classList.add("d-none");
      this.$nextTick(() => {
        const ele = document.getElementById("orderListTable");
        if (ele) ele.scrollTop = this.scrollPos;
      });
    },
    paserOrderPaginate(data, reset = false) {
      let itemCount = reset ? 0 : this.loadedItems;
      this.orderPaginate = _.chunk(data, 20);
      this.displayedItems.splice(0, this.displayedItems.length);
      for (var i = 0; i <= itemCount; i++) {
        if (this.orderPaginate[i])
          this.displayedItems.push(...this.orderPaginate[i]);
      }
      this.displayedItem = 0;
    },
    async changeColumns() {
      if (this.headerObject && this.headerObject.sort) {
        let field = this.fields.find(
          (x) => x.key == this.headerObject.sort.key
        );
        if (field) {
          field.sort = this.headerObject.sort.sort;
        }
      }
      await this.$nextTick();
      this.$refs.rowHeader.childNodes.forEach((x) => {
        let cell = x.getElementsByClassName("th-fixed")[0];
        cell.style.left = x.offsetLeft + "px";
        cell.style.width = x.clientWidth + "px";
        cell.style.height = x.clientHeight + "px";
      });
    },
    onResize() {
      this.changeColumns();
    },
    onSearchOptionsByColumn(evt, key) {
      this.searchFilter.value = evt.target.value;
      this.searchFilter.key = key;
    },
    onClickShowFilter(id) {
      const ele = document.getElementById(id);
      if (ele instanceof HTMLElement) {
        ele.classList.remove("right");
        if (!_.includes(ele.classList, "show")) {
          const filter = document.getElementsByClassName(
            "filter-dropdown show"
          );
          if (filter.length) {
            this.toggleFilter(filter[0].parentElement, filter[0]);
          }
        }
        this.toggleFilter(ele.parentElement, ele);
        let content = this.$refs.tableContent;
        let parent = ele.parentElement;
        if (parent.offsetLeft + ele.clientWidth > content.clientWidth) {
          ele.classList.add("right");
        }
        if (
          this.$refs["inputDateTime-" + id] &&
          this.$refs["inputDateTime-" + id].length
        ) {
          setTimeout(() => {
            this.$refs["inputDateTime-" + id][0].$el.focus();
          }, 100);
        }
        if (
          this.$refs["inputSearch-" + id] &&
          this.$refs["inputSearch-" + id].length
        ) {
          setTimeout(() => {
            this.$refs["inputSearch-" + id][0].focus();
          }, 100);
        }
      }
    },
    toggleFilter(elementParent, elementFilter) {
      if (_.includes(elementParent.classList, "active")) {
        elementParent.classList.remove("active");
        elementFilter.classList.remove("show");
      } else {
        elementParent.classList.add("active");
        elementFilter.classList.add("show");
      }
    },
    onClickOutSiteHeader(event) {
      if (!_.includes(event.target.classList, "th-fixed")) {
        const elements = document.getElementsByClassName("th-fixed active");
        _.forEach(elements, (ele) => {
          ele.classList.remove("active");
        });

        const elementsFilter = document.getElementsByClassName(
          "filter-dropdown show"
        );
        _.forEach(elementsFilter, (ele) => {
          ele.classList.remove("show");
        });
      }
    },
    async sortTableByField(field) {
      field.sort = field.sort != "desc" ? "desc" : "asc";
      this.$set(this.headerObject, "sort", { ...field });
      await this.onStartSorting();
    },
    onStartSorting() {
      this.paserOrderPaginate(this.filteredItems);
    },
    onFilterByColumn(option) {
      //option.checked = !option.checked;
      if (option.checked) {
        this.headerObject.filters.push({
          key: option.key,
          value: option.value,
        });
      } else {
        const indexOption = this.headerObject.filters.findIndex(
          (item) => item.key == option.key && item.value == option.value
        );
        this.headerObject.filters.splice(indexOption, 1);
      }
      this.items.forEach((x) => {
        x.SELECTED = false;
      });
      this.paserOrderPaginate(this.filteredItems, true);
    },
    isShowFilterIcon(key) {
      return !!this.headerObject.filters.find((o) => o.key === key);
    },
    isDateColumn(key) {
      if (key && key.includes("DATE")) return true;
      return false;
    },
    onScrollToTop() {
      $(this.$refs.tableContent).animate({ scrollTop: 0 }, "fast");
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      //let keepcurrent = this.currentIndexRowFocus;
      if (scrollTop + clientHeight + 100 >= scrollHeight) {
        this.displayedItem += 1;
        if (
          this.displayedItems &&
          this.filteredItems &&
          this.displayedItems.length <= this.filteredItems.length
        ) {
          if (!!this.orderPaginate && !!this.orderPaginate[this.displayedItem])
            this.displayedItems.push(...this.orderPaginate[this.displayedItem]);
        }
      }
      if (scrollTop >= 200) {
        this.btnScroll.classList.remove("d-none");
      } else {
        if (!this.btnScroll.classList.contains("d-none")) {
          this.btnScroll.classList.add("d-none");
        }
      }
    },
    getOptionsFilterByField(field) {
      let key = this.getKeyByField(field.key);
      const keyLabel = key;
      const res = _.groupBy(this.items, key);
      for (const k in res) {
        if (k == "null" || k == "undefined" || !k) {
          let emptyKeys = Object.keys(res).filter(
            (x) => x == "null" || x == "undefined" || !x
          );
          if (emptyKeys.length >= 2) {
            let vals = [];
            emptyKeys.forEach((x) => {
              vals.push(...res[x]);
            });
            emptyKeys.forEach((x) => {
              res[x] = vals;
            });
            break;
          }
        }
      }
      let options = Object.keys(res).map((k) => {
        let label =
          k != "null" && k != "undefined" && k
            ? !keyLabel
              ? k
              : res[k][0][keyLabel]
            : "(Blanks)";
        let value =
          k.toString() !== "null" && k.toString() !== "undefined" ? k : null;
        if (
          this.isDateColumn(key) &&
          k.toString() !== "null" &&
          k.toString() !== "undefined" &&
          k
        ) {
          label = moment(k).format("DD-MMM-YYYY");
        }
        value = this.isDateColumn(key)
          ? label != "(Blanks)"
            ? label
            : ""
          : value;
        let checked = false;
        if (this.headerObject.filters.length > 0) {
          checked = this.headerObject.filters.some(
            (x) => x.key == field.key && x.value == value
          );
        }
        return {
          label: label || value,
          key: field.key,
          date: this.isDateColumn(key) ? new Date(k).getTime() : null,
          checked: checked,
          count: res[k].length,
          value: value || null,
        };
      });
      const result = _(options)
        .groupBy("label")
        .map((items) => {
          return {
            ...items[0],
            count:
              items[0].count > items.length ? items[0].count : items.length,
          };
        })
        .value();
      if (this.isDateColumn(key)) {
        this.$set(
          this.optionsByFields,
          field.key,
          _.sortBy(result, ["date"]).reverse()
        );
      } else {
        this.$set(this.optionsByFields, field.key, _.sortBy(result, ["label"]));
      }
    },
    getKeyByField(key) {
      return key;
    },
    onRowDbclick(item) {
      this.$emit("rowDbClick", item);
    },
  },
  computed: {
    filteredItems: function () {
      let result = [];
      let keys = this.headerObject.filters
        .filter(
          (x, i) =>
            this.headerObject.filters.findIndex((xx) => xx.key == x.key) == i
        )
        .map((x) => x.key);
      if (this.items) {
        result = this.items.filter((item) => {
          let isMatch = true;
          if (keys.length > 0) {
            for (const key of keys) {
              const values = this.headerObject.filters
                .filter((x) => x.key == key)
                .map((x) => x.value);
              let value = item[this.getKeyByField(key)] || "";
              if (value && this.isDateColumn(key)) {
                value = moment(value).format("DD-MMM-YYYY");
              }
              if (!values.some((x) => (x || "") == value)) {
                return false;
              }
            }
          }
          return isMatch;
        });
      }
      if (this.headerObject.sort.key) {
        result = _.orderBy(
          result,
          [this.headerObject.sort.key],
          [this.headerObject.sort.sort]
        );
      }
      // this.headerObject.filteredCount = `${result.length}`;
      // this.$emit("update:filteredOrders", result);
      return result;
    },
    filteredFilters: function () {
      let result = {};
      for (const key in this.optionsByFields) {
        let items = this.optionsByFields[key];
        if (key == this.searchFilter.key) {
          items = items.filter(
            (x) =>
              !this.searchFilter.value ||
              (x.label &&
                x.label
                  .toLowerCase()
                  .includes(this.searchFilter.value.toLowerCase())) ||
              (x.value &&
                x.value
                  .toLowerCase()
                  .includes(this.searchFilter.value.toLowerCase()))
          );
        }
        result[key] = items;
      }
      return result;
    },
  },
  watch: {
    items: function () {
      this.onChangeItems();
    },
    displayedItems: async function () {
      this.changeColumns();
      await this.$nextTick();
    },
  },
});
</script>