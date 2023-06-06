<<<<<<< HEAD
// ---------- 手機版 header 選單收合 ----------
$(document).ready(() => {
  //點擊 btn 控制選單出現、消失
  $(".header_mobile_btn").click(() => {
    $(".header_mobile_menu").toggleClass("show");
  });
});

// ---------- swiper輪播動畫 ----------
//new Swiper() 有兩個參數：
// 第一個參數為字串，需填入欲套用輪播效果的 swiper 容器，以上述基本結構為例，swiper 容器為 .swiper
// 第二個參數為物件，非必填，可以填入想調整的選項
const swiper = new Swiper(".swiper", {
  slidesPerView: 1, // 一次看幾個
  spaceBetween: 24, // 間距(px)

  // swiper 斷點設定為 mobile first
  breakpoints: {
    576: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true, // 点击分页器的指示点分页器会控制 Swiper 切换
  },
});

// ---------- QA收合選單 ----------
$(".question_item").click(function () {
  $(this).toggleClass("active");
});

// ---------- toTop ----------
$(".toTop").click(() => {
  $("html").animate(
    {
      scrollTop: 0,
    },
    1000
  );
});

// ---------- API ----------
// *** 資料串接 ***
const apiPath = "https://2023-engineer-camp.zeabur.app";
const list = document.querySelector("#aiList");
const pagination = document.querySelector("#pagination");

let worksData = [];
let pagesData = {};

const data = {
  type: "",
  sort: 0,
  page: 1,
  search: "",
};

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
    type ? `type=${type}&` : ""
  }${search ? `search=${search}&` : ""}`;

  axios.get(apiUrl).then((response) => {
    // console.log(response.data);

    worksData = response.data.ai_works.data;
    pagesData = response.data.ai_works.page;

    console.log("worksData", worksData);
    console.log("pageData", pagesData);

    renderWorks();
    renderPages();
  });
}

getData(data);

// *** 作品選染至畫面 ***
function renderWorks() {
  let works = "";

  worksData.forEach((item) => {
    works += /*html*/ `<li class="tool_card card">
    <div class="tool_card_img">
      <img
        src="${item.imageUrl}"
        alt="ai image"
      />
    </div>
    <div class="tool_card_body">
      <h3 class="title-xs">${item.title}</h3>
      <p class="text-s">
        ${item.description}
      </p>
    </div>
    <div class="tool_card_ai">
      <span class="text-m-bold">AI 模型</span>
      <p class="text-m">${item.model}</p>
    </div>
    <div class="tool_card_tag">
      <p class="text-m">#${item.type}</p>
      <a href="${item.link}" target="_blank"><span class="material-icons icon-m"> share </span></a>
    </div>
  </li>`;
  });
  list.innerHTML = works;
}

// ---------- 搜尋 ----------
const search = document.querySelector("#search");
search.addEventListener("keydown", (e) => {
  //按下 enter 時
  if (e.keyCode === 13) {
    data.search = search.Value;
    data.page = 1;
    getData(data);
  }
});

// ---------- 排序、篩選----------
// *** 收合篩選選單-全部篩選 ***
let tempFilterName = []; // ai 加入 [0]、type 加入 [1]，最後用 join("、") 連接
let filterName;

// 篩選選單 - 出現、消失
$(document).ready(() => {
  $(".tool_filter_all_btn").click(() => {
    $(".tool_filter_all_menu").toggleClass("show");
  });

  // 篩選選單 - Ai模型
  $(".tool_filter_all_menu_ai").click(function () {
    // filetr-icon 變黑底白字
    $(".tool_filter_all_btn .material-icons").addClass("icon-white");
    // active
    $(".tool_filter_all_menu_ai").removeClass("active");
    $(this).addClass("active");
    // btn文字
    tempFilterName[0] = $(this).find(".filter_name").text().trim();
    filterName = tempFilterName.join("、");
    $(".tool_filter_all_btn_txt").text(filterName);
    // console.log(filterName);
  });

  // 篩選選單 - 類型
  $(".tool_filter_all_menu_type").click(function () {
    // filetr-icon 變黑底白字
    $(".tool_filter_all_btn .material-icons").addClass("icon-white");
    // active
    $(".tool_filter_all_menu_type").removeClass("active");
    $(this).addClass("active");
    // btn文字
    tempFilterName[1] = $(this).find(".filter_name").text().trim();
    filterName = tempFilterName.filter((x) => x !== undefined).join("、"); // 若沒有選 ai 篩選，要去除 [0] 沒有值，避免出現 "、"
    $(".tool_filter_all_btn_txt").text(filterName);
    // console.log(filterName);
  });
});

// *** 切換作品類型 ***
const filterBtns = document.querySelectorAll(".filterBtn");
filterBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    $(filterBtns).removeClass("active");
    $(item).addClass("active");
    if (item.textContent === "全部") {
      data.type = "";
    } else {
      data.type = item.textContent;
      console.log(data);
    }
    getData(data);
  });
});

// *** 切換作品排序 ***
const desc = document.querySelector("#desc");
const asc = document.querySelector("#asc");

// 由新到舊 -> sort = 0
desc.addEventListener("click", () => {
  data.sort = 0;
  getData(data);
});

//由舊到新 -> sort = 1
asc.addEventListener("click", () => {
  data.sort = 1;
  getData(data);
});

// ---------- 分頁 ----------
// *** 切換分頁 ***
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll("a.pageLink");
  let pageId = "";
  pageLinks.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); //取消預設行為(連結)
      pageId = e.target.dataset.page;
      data.page = Number(pageId);
      // console.log(e.target.dataset.page);

      //下一頁
      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1;
      }
      getData(data);
    });
  });
}

// *** 分頁渲染至畫面 ***
function renderPages() {
  let pageStr = "";
  for (let i = 1; i <= pagesData.total_pages; i++) {
    pageStr += /*html*/ `<li>
    <a href="#" class="pageLink ${
      pagesData.current_page == i ? "page-active" : ""
    }" data-page="${i}">${i}</a>
    </li>`;
  }

  if (pagesData.has_next) {
    pageStr += /*html*/ `<li>
    <a href="#" class="pageLink">
      <span class="material-icons icon-s"> keyboard_arrow_right </span>
    </a>
  </li>`;
  }
  pagination.innerHTML = pageStr;
  changePage(pagesData);
}

// // *** 收合篩選選單-時間 ***
// $(document).ready(() => {
//   //點擊 btn 控制選單出現、消失
//   $(".tool_filter_time_btn").click(() => {
//     $(".tool_filter_time_menu").toggleClass("show");
//   });

//   //點擊選單選項後切換 btn 文字，並選單消失
//   $(".new-to-old,.old-to-new").click(function () {
//     $(".tool_filter_time_btn_txt").text($(this).text());
//     $(".tool_filter_time_menu").toggleClass("show");
//   });
// });
=======
// ---------- 手機版 header 選單收合 ----------
$(document).ready(() => {
  //點擊 btn 控制選單出現、消失
  $(".header_mobile_btn").click(() => {
    $(".header_mobile_menu").toggleClass("show");
  });
});

// ---------- swiper輪播動畫 ----------
//new Swiper() 有兩個參數：
// 第一個參數為字串，需填入欲套用輪播效果的 swiper 容器，以上述基本結構為例，swiper 容器為 .swiper
// 第二個參數為物件，非必填，可以填入想調整的選項
const swiper = new Swiper(".swiper", {
  slidesPerView: 1, // 一次看幾個
  spaceBetween: 24, // 間距(px)

  // swiper 斷點設定為 mobile first
  breakpoints: {
    576: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true, // 点击分页器的指示点分页器会控制 Swiper 切换
  },
});

// ---------- QA收合選單 ----------
$(".question_item").click(function () {
  $(this).toggleClass("active");
});

// ---------- toTop ----------
$(".toTop").click(() => {
  $("html").animate(
    {
      scrollTop: 0,
    },
    1000
  );
});

// ---------- API ----------
// *** 資料串接 ***
const apiPath = "https://2023-engineer-camp.zeabur.app";
const list = document.querySelector("#aiList");
const pagination = document.querySelector("#pagination");

let worksData = [];
let pagesData = {};

const data = {
  type: "",
  sort: 0,
  page: 1,
  search: "",
};

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
    type ? `type=${type}&` : ""
  }${search ? `search=${search}&` : ""}`;

  axios.get(apiUrl).then((response) => {
    // console.log(response.data);

    worksData = response.data.ai_works.data;
    pagesData = response.data.ai_works.page;

    console.log("worksData", worksData);
    console.log("pageData", pagesData);

    renderWorks();
    renderPages();
  });
}

getData(data);

// *** 作品選染至畫面 ***
function renderWorks() {
  let works = "";

  worksData.forEach((item) => {
    works += /*html*/ `<li class="tool_card card">
    <div class="tool_card_img">
      <img
        src="${item.imageUrl}"
        alt="ai image"
      />
    </div>
    <div class="tool_card_body">
      <h3 class="title-xs">${item.title}</h3>
      <p class="text-s">
        ${item.description}
      </p>
    </div>
    <div class="tool_card_ai">
      <span class="text-m-bold">AI 模型</span>
      <p class="text-m">${item.model}</p>
    </div>
    <div class="tool_card_tag">
      <p class="text-m">#${item.type}</p>
      <a href="${item.link}" target="_blank"><span class="material-icons icon-m"> share </span></a>
    </div>
  </li>`;
  });
  list.innerHTML = works;
}

// ---------- 搜尋 ----------
const search = document.querySelector("#search");
search.addEventListener("keydown", (e) => {
  //按下 enter 時
  if (e.keyCode === 13) {
    data.search = search.Value;
    data.page = 1;
    getData(data);
  }
});

// ---------- 排序、篩選----------
// *** 收合篩選選單-全部篩選 ***
let tempFilterName = []; // ai 加入 [0]、type 加入 [1]，最後用 join("、") 連接
let filterName;

// 篩選選單 - 出現、消失
$(document).ready(() => {
  $(".tool_filter_all_btn").click(() => {
    $(".tool_filter_all_menu").toggleClass("show");
  });

  // 篩選選單 - Ai模型
  $(".tool_filter_all_menu_ai").click(function () {
    // filetr-icon 變黑底白字
    $(".tool_filter_all_btn .material-icons").addClass("icon-white");
    // active
    $(".tool_filter_all_menu_ai").removeClass("active");
    $(this).addClass("active");
    // btn文字
    tempFilterName[0] = $(this).find(".filter_name").text().trim();
    filterName = tempFilterName.join("、");
    $(".tool_filter_all_btn_txt").text(filterName);
    // console.log(filterName);
  });

  // 篩選選單 - 類型
  $(".tool_filter_all_menu_type").click(function () {
    // filetr-icon 變黑底白字
    $(".tool_filter_all_btn .material-icons").addClass("icon-white");
    // active
    $(".tool_filter_all_menu_type").removeClass("active");
    $(this).addClass("active");
    // btn文字
    tempFilterName[1] = $(this).find(".filter_name").text().trim();
    filterName = tempFilterName.filter((x) => x !== undefined).join("、"); // 若沒有選 ai 篩選，要去除 [0] 沒有值，避免出現 "、"
    $(".tool_filter_all_btn_txt").text(filterName);
    // console.log(filterName);
  });
});

// *** 切換作品類型 ***
const filterBtns = document.querySelectorAll(".filterBtn");
filterBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    $(filterBtns).removeClass("active");
    $(item).addClass("active");
    if (item.textContent === "全部") {
      data.type = "";
    } else {
      data.type = item.textContent;
      console.log(data);
    }
    getData(data);
  });
});

// *** 切換作品排序 ***
const desc = document.querySelector("#desc");
const asc = document.querySelector("#asc");

// 由新到舊 -> sort = 0
desc.addEventListener("click", () => {
  data.sort = 0;
  getData(data);
});

//由舊到新 -> sort = 1
asc.addEventListener("click", () => {
  data.sort = 1;
  getData(data);
});

// ---------- 分頁 ----------
// *** 切換分頁 ***
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll("a.pageLink");
  let pageId = "";
  pageLinks.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); //取消預設行為(連結)
      pageId = e.target.dataset.page;
      data.page = Number(pageId);
      // console.log(e.target.dataset.page);

      //下一頁
      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1;
      }
      getData(data);
    });
  });
}

// *** 分頁渲染至畫面 ***
function renderPages() {
  let pageStr = "";
  for (let i = 1; i <= pagesData.total_pages; i++) {
    pageStr += /*html*/ `<li>
    <a href="#" class="pageLink ${
      pagesData.current_page == i ? "page-active" : ""
    }" data-page="${i}">${i}</a>
    </li>`;
  }

  if (pagesData.has_next) {
    pageStr += /*html*/ `<li>
    <a href="#" class="pageLink">
      <span class="material-icons icon-s"> keyboard_arrow_right </span>
    </a>
  </li>`;
  }
  pagination.innerHTML = pageStr;
  changePage(pagesData);
}

// // *** 收合篩選選單-時間 ***
// $(document).ready(() => {
//   //點擊 btn 控制選單出現、消失
//   $(".tool_filter_time_btn").click(() => {
//     $(".tool_filter_time_menu").toggleClass("show");
//   });

//   //點擊選單選項後切換 btn 文字，並選單消失
//   $(".new-to-old,.old-to-new").click(function () {
//     $(".tool_filter_time_btn_txt").text($(this).text());
//     $(".tool_filter_time_menu").toggleClass("show");
//   });
// });
>>>>>>> d8d2b23ff3ce531c69b2b2c3ed0d2da62e7c0211
