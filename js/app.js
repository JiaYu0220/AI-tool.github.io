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

// ---------- 排序、篩選----------
// *** 切換作品排序 ***
const desc = document.querySelector("#desc");
const asc = document.querySelector("#asc");

// 由新到舊 -> sort = 0
desc.addEventListener("click", (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
});

//由舊到新 -> sort = 1
asc.addEventListener("click", (e) => {
  e.preventDefault();
  data.sort = 1;
  getData(data);
});

// *** 切換作品類型 ***
const filterBtns = document.querySelectorAll("#filterBtn");
filterBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    if (item.textContent === "全部") {
      data.type = "";
    } else {
      data.type = item.textContent;
    }
    getData(data);
  });
});

//搜尋
const search = document.querySelector("#search");
search.addEventListener("keydown", (e) => {
  //按下 enter 時
  if (e.keyCode === 13) {
    data.search = search.Value;
    data.page = 1;
    getData(data);
  }
});

// ---------- 動畫 ----------
// *** 輪播動畫 ***
$(document).ready(() => {
  let currentIndex = 0;

  function showSildes(index) {
    console.log(index);
    // 移除class名稱
    $(".recommend_carousel_item").removeClass("active");
    $(".recommend_indicator_item").removeClass("active");

    //eq(index).addClass("active")： 為 index = currentIndex 的物件增加class名稱
    $(".recommend_carousel_item").eq(index).addClass("active");
    $(".recommend_indicator_item").eq(index).addClass("active");

    //card 由左到右排列，最左邊的 card 會顯示在畫面中，每個card相隔 100% 的距離
    // css 要先把 card 之間的 gap 拿掉，否則無法對其
    let transitionValue = -(index * 100) + "%";
    $(".recommend_carousel_item").css(
      "transform",
      "translateX(" + transitionValue + ")"
    );
  }

  $(".recommend_indicator_item").click(function () {
    //index()返回当前指示器元素在其同级元素中的索引值（從0開始計數）
    currentIndex = $(this).index();
    // console.log(currentIndex);
    showSildes(currentIndex);
  });
});

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

//切換作品類型
$(document).ready(() => {
  $("#filterBtn a").click(() => {
    $("#filterBtn a").removeClass(".active");
    $(this).addClass(".active");
  });
});

// *** 收合篩選選單-時間 ***
$(document).ready(() => {
  //點擊 btn 控制選單出現、消失
  $(".tool_filter_time_btn").click(() => {
    $(".tool_filter_time_menu").toggleClass("show");
  });

  //點擊選單選項後切換 btn 文字，並選單消失
  $(".new-to-old,.old-to-new").click(function () {
    $(".tool_filter_time_btn_txt").text($(this).text());
    $(".tool_filter_time_menu").toggleClass("show");
  });
});

// *** QA收合選單 ***
$(".question_item").click(function () {
  $(this).toggleClass("active");
});

// *** toTop ***
$(".toTop").click(() => {
  $("html").animate(
    {
      scrollTop: 0,
    },
    1000
  );
});
