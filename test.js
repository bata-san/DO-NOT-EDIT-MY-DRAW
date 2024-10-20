var server_root_url = "http://chomechome.ne.jp/eclips/";

//繰り返し継続的に画像に右クリック禁止とドラッグ＆ドロップ禁止をかけ続ける
var setIV = setInterval('checkWindow()', 250);

function checkWindow() {

    $('.protect').attr({
        onSelectStart: "return false",
        oncontextmenu: "return false",
        onMouseDown: "return false",
        onMouseUp: "return false",
        onMouseOver: "return false",
        onMouseOut: "return false"
    });

}

// Windowがfocusされているか否かで画像を見え隠れする
window.onblur = function () {

    jQuery('.protect').css({ opacity: "1" }).animate({ opacity: '0.05' }, 250);

};

window.onfocus = function () {

    jQuery('.protect').css({ opacity: "0.05" }).animate({ opacity: '1' }, 250);

};

//MacとWindows標準のスクリーンショットのためのキーを押された時に画像を見えなくする
document.addEventListener('keydown', (event) => {

    if (event.shiftKey == true || event.ctrlKey == true || event.altKey == true) {

        jQuery('.protect').css({ opacity: "1" }).animate({ opacity: '0.05' }, 250);

    }

}, false);

document.addEventListener('keyup', (event) => {

    if (event.shiftKey == false && event.ctrlKey == false && event.altKey == false) {

        jQuery('.protect').css({ opacity: "0.05" }).animate({ opacity: '1' }, 250);

    }

}, false);

// サーバにエンコードされた画像のurlを送りデコードする処理
window.onload = function () {

    // このJavaScriptを動的に生成し、デコードリクエストに必要な瞬間的に有効なトークンを持たせる
    var token = "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tClZlcnNpb246IEdudVBHIHYyLjAuMTQgKEdOVS9MaW51eCkKCmhRSU1BOE5UMi92QmxjTTFBUS8vWkwvRXc4dlNGbmRmbll6VXp6KzBGdWJOSWJ0ZlpsNWZjeUNocDVIVDJ0L2oKbzl4WWQ2Tk8rYngyNkdHM29ibkRyaWJYQU14UDR5Mk1Venlielh4Q1F1Y0IxV0NhWEdsYjBKQk5iblZjL1dERgpnVGFwOWo0ZnJ5Y2plc3dQSnNGNUo3djBFQUNkc05ETG10K2laTklRcXpBdXpHTGpib3A2Vng2ZWVnTzNwZ2ZBCkV2V2RPckFIMU9pQ1B4VkNYbWdMdjZkekFCTE1ndDlNekpmUVhtTWdmV25tSXZ0YnVTaTdnMm1kUVc2UEFLRGgKTU1HT1pPWmlxOWduMWtpV1N0ZXVUalFTRWpzbHdKZFhwR1o1Y0pUL2FxenVsbWIwUmVJTVlqZ05yOUNXaWdxQgpnbmpMdUVVR3o1WWdWNmI3NkdpVzNmbWQ1eWRXY3ZvaHhYWWd0SjVzbEdabi94aXF4QVhFTmdjc1FYTy9Gcnc5CmpMakl2bnhrRXVkSGtGR0FlelhLS3pZaHZFYk9LMUVsYnpCaEVQNWo4RzZYbFdHZzBiMGdBMnVFMzFWb3YvaC8KUkU5VVNTbGt0MWR6dmZrODg5NG03QzUxSnlaamtHYWJGZEN3SmRvZmtYRmJrM2JJUlk5YkFjWGpwZUVHSWNBdgpBeXYrM3NVaUlxd3hKc2xyOERscnBKeGFZai9JV0ZnSEE3d3J2Y2xRL0F2cG5RaktPVkhsWXBZN25pd3p4OGpQCkRNSHlIa21tWnJXTjdSQ21NOHhzcWN0TGo4SGd5NHg3V28xdkcrVFkvSml0eDlkanVLYng5cUxBcGZ3cDFoVDkKTjczNi9qdEpJeHBOTXZhYzdEN0xmT09UYndZcGRMdm92ZUNRbDkwZnpWQVhJNU5iL3VzcGRBWVRzcmhMSjdmUwpTZ0ZlZUJwcGpZWGdLSlZURWsvWFhOSUJoOUJGeWphTzg1SkRyd2xWcXVsTERaVGQ1akptS0dZWlJ2U1g1NXlBCjVqZGM3SlhaZHQ5K211MDMwVU5aLzJnVEw0eGVOYm1VRVlOMgo9WlMwcwotLS0tLUVORCBQR1AgTUVTU0FHRS0tLS0tCg==";

    // 画像を表示しようとしているページのurl（動的生成）
    var page_url = "hogehoge.ne.jp/test.html";

    // 画像を表示させようとしているクライアントのホスト名（動的生成）
    var client_hostname = "g7.124-44-19.ppp.hogehoge.ne.jp";

    var img = new Array();
    img = document.getElementsByClassName('protect');

    for (var i = 0; i < img.length; i++) {

        var srcImage = img[i].getAttribute('src');

        var imgFullUrl = jQuery('img.protect')[i].src;

        var decodedImageUrl =
            server_root_url + 'decode.php?token=' + token
            + '&src=' + encodeURIComponent(imgFullUrl)
            + '&page_url=' + encodeURIComponent(page_url)
            + '&client_hostname=' + encodeURIComponent(client_hostname);

        var image = new Image();

        img[i].setAttribute('src', decodedImageUrl);

    }

};
//code by https://qiita.com/MATS-Electric-Blue-Industries/items/8f03fd3b476bab775dd3