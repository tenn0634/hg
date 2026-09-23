/**************************************
功能：Quantumult X 视频 m3u8 请求诊断/通知脚本
说明：仅处理授权服务的播放清单请求，保留原始 URL 和请求头。
***************************************/

[rewrite_local]

^https?:\/\/[^\/]+\/(?:api\/app\/vid\/h5\/m3u8\/|api\/app\/vid\/sec(?:\?|$)).* url script-request-header https://raw.githubusercontent.com/89996462/Quantumult-X/main/ghs/hgdj.js

[mitm]

hostname = *.cloudfront.net, *.4a6xf.com, *.lkkwip.cn, *.kuqawj.cn

***************************************/

(function () {
  const request = $request || {};
  const url = request.url || '';
  const headers = request.headers || {};
  const m3u8Path = /\/api\/app\/vid\/h5\/m3u8\//i.test(url);
  const keyPath = /\/api\/app\/vid\/sec(?:\?|$)/i.test(url);

  if (!m3u8Path && !keyPath) {
    return $done({ request: { headers } });
  }

  const hostMatch = url.match(/^https?:\/\/([^/]+)/i);
  const host = hostMatch ? hostMatch[1].toLowerCase() : '';
  const supportedHost =
    /(?:^|\.)cloudfront\.net$/i.test(host) ||
    /(?:^|\.)4a6xf\.com$/i.test(host) ||
    /(?:^|\.)lkkwip\.cn$/i.test(host) ||
    /(?:^|\.)kuqawj\.cn$/i.test(host);

  if (supportedHost && m3u8Path) {
    console.log('[hgdj] m3u8 命中: ' + url);
    notify('视频链接捕获成功', '点击通知即可观看', url);
  } else if (supportedHost && keyPath) {
    console.log('[hgdj] AES key 请求: ' + url);
  }

  // 不改写 URL、不替换域名、不删除鉴权请求头。
  $done({ request: { headers } });

  function notify(title, subtitle, openUrl) {
    if (typeof $notification !== 'undefined' && $notification.post) {
      $notification.post(title, subtitle, '', { url: openUrl });
    } else if (typeof $notify !== 'undefined') {
      $notify(title, subtitle, '', { 'open-url': openUrl });
    }
  }
})();
