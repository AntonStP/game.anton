/* eslint-disable */

// ---
export function getUrlParams( _url ){
  const url = document.createElement('a');
  url.href = _url;
  const data = {
    protocol: url.protocol, // (http:)
    hostname: url.hostname, // (www.example.com)
    pathname: url.pathname, // (/some/path)
    search: url.search ? url.search.substring(1) : '', // (?name=value)
    hash: url.hash ? url.hash.substring(1) : '', // (#anchor)
    path: `${url.protocol}//${url.hostname}`
  };
  // if( data.search ) {
  //   // data.searchObject = JSON.parse('{"' + decodeURI(data.search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  //   data.searchObject = decodeURI(data.search).split('&');
  // }
  return data;
}



// ---
let baseUrlData;

export function getBaseUrlParams(){
  baseUrlData = getUrlParams(window.location.href);
  // console.log('baseUrlData', baseUrlData);
};



// ---
export function fixLinks( selector, updateOnlyIfHasBaseUrlParams ){

  if( updateOnlyIfHasBaseUrlParams && !baseUrlData.search ) return;

  document.querySelectorAll(`a[href*="${selector}"]`).forEach(node => {

    // stoloto.ru
    // stoloto.ru/#page
    // stoloto.ru?param=1 // params
    // stoloto.ru?param=1#page  // params

    const urlData = getUrlParams(node.href);
    /*
    let url = urlData.path;

    if ( baseUrlData.search || urlData.search ){
      // node.href += (node.href.indexOf("?") === -1 ? "?" : "&") + params;
      // urlData.search ? urlData.search;
      url += '?' + urlData.search + ( urlData.search ? '&' : '') + baseUrlData.search; // TODO: чего делать если в базовой урл и в ссылке одинаковые параметры?
    }
    if( urlData.hash ) url += '#'+urlData.hash;
    // console.log('URLL:', url );
     */
    const url = urlDataToUrl( urlData, baseUrlData.search );
    node.href = decodeURI(url);
  });

};


// ---
export function urlDataToUrl( urlData, addSearchParams = ''){
  console.log('urlDataToUrl', urlData, addSearchParams );
  let url = urlData.path + urlData.pathname;
  if ( addSearchParams || urlData.search ){
    url += '?' + urlData.search + ( urlData.search && addSearchParams ? '&' : '') + ( Array.isArray(addSearchParams) ? addSearchParams.join('&') : addSearchParams); // TODO: чего делать если в базовой урл и в ссылке одинаковые параметры?
  }
  if( urlData.hash ) url += '#'+urlData.hash;
  return url;
}


// --- UNUSED
/*
let utmParams = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

export function removeUTMFromUrlData( urlData ){
  let isString;
  if( typeof urlData === 'string' ) {
    urlData = getUrlParams(urlData);
    isString = true;
  }
  if( !urlData.search ) return urlData;
  let searchObject = decodeURI(urlData.search).split('&');
  searchObject = searchObject.filter(e=>{
    const ee = e.split('=');
    return utmParams.indexOf(ee[0]) === -1;
  });
  urlData.search = searchObject.join('&');
  return isString ? urlDataToUrl(urlData) : urlData;
}


// !!! >>>
// console.log('REMOVE 1', removeUTMFromUrlData(getUrlParams('http://ya.ru?param1=1&utm_source#page' )) );
// console.log('REMOVE 2', removeUTMFromUrlData('http://ya.ru?param1=1&utm_source#page' ) );
// !!! <<<
*/
