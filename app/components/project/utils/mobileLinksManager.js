/* eslint-disable */
// import $ from 'jquery';
import isMobile from 'ismobilejs';

export function mobileLinksManager(){
	if (isMobile.any){
		$("[data-mhref]").each((i,e)=>{
			e = $(e);
			e.attr("href", e.data("mhref"));
			// console.log('mobileLinksManager', e, e.data("mhref") );
		});
	}
}
