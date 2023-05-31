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
// 選單出現、消失
$(document).ready(() => {
  $(".tool_filter_all_btn").click(() => {
    $(".tool_filter_all_menu").toggleClass("show");
  });
  // 篩選 Ai模型
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

  // 篩選 類型
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
