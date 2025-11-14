var BankName = "Books to Scrape";
var moduleVersion = '25.11.13.1';
console.log(BankName + " 스크립트 호출됨.");
console.log('Version: ' + moduleVersion);


function iSASObject() {
    console.log("iSASObject 생성자 호출");
    this.iSASInOut = {};
}

iSASObject.prototype.log = function(logMsg) {
    try {
        SASLog("iSASObject.Log(" + logMsg + "\")");
    } catch (e) {
        console.log("iSASObject.Log(" + logMsg + "\")");
    }
};

iSASObject.prototype.setError = function(errcode) {
    this.iSASInOut.Output = {};
    this.iSASInOut.Output.ErrorCode = errcode.toString(16).toUpperCase();
    //TODO: 에러 메시지 가져오는 부분...
    this.iSASInOut.Output.ErrorMessage = getCooconErrMsg(errcode.toString(16));
};

var VIEW = function() {
    //생성자
    console.log(BankName + " Books to Scrape 생성자 호출");
    this.errorMsg = "";
    this.host = "https://books.toscrape.com";
    this.url = "";
    this.param = "";
    this.postData = "";
    this.xgate_addr = "";
    this.bLogIn = false;
    this.scrapedData = [];

};

VIEW.prototype = Object.create(iSASObject.prototype);

VIEW.prototype.removeTags = function (str, reStr) {
    if (str === null || str === "") return '';
    else str = str.toString();
    if (!reStr) reStr = '';
    else reStr = ' ';
    return str.replace(/(<([^>]+)>)/gi, reStr);
};

VIEW.prototype.Special_Char_Remove = function (tempStr) {
    tempStr = StrReplace(tempStr, "&amp;", "&");
    tempStr = StrReplace(tempStr, "&amp", "&");
    tempStr = StrReplace(tempStr, "&nbsp;", " ");
    tempStr = StrReplace(tempStr, "&#39;", " ");
    tempStr = StrReplace(tempStr, "&#160;", " ");
    tempStr = StrReplace(tempStr, "&lt;", "<");
    tempStr = StrReplace(tempStr, "&gt;", ">");
    tempStr = StrReplace(tempStr, "&middot;", "·");
    tempStr = StrReplace(tempStr, "&rarr;", "→");
    tempStr = StrReplace(tempStr, "&acute;", "´");

    return tempStr;
};

VIEW.prototype.rate = function (starText) {
    // starClass may look like: ' star-rating Three"'
    // Extract star name ('One', 'Two', etc.)
    if (!starText) return 0;
    switch (starText.toLowerCase()) {
        case 'one': return 1;
        case 'two': return 2;
        case 'three': return 3;
        case 'four': return 4;
        case 'five': return 5;
        default: return 0;
    }
}

VIEW.prototype.BOOKSCRAPEINFO = function(aInput) {
    this.log(BankName + " BOOKSCRAPEINFO 스크래핑 호출 [" + aInput + "][" + moduleVersion + "]");
    try {

        system.setStatus(IBXSTATE_ENTER, 10);
        
        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Whale/4.34.340.19 Safari/537.36",';
        this.userAgent += '"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",';
        this.userAgent += '"Accept-Encoding":"gzip, deflate, br",';
        this.userAgent += '"Accept-Language":"en-US,en;q=0.9,ko;q=0.8,ru;q=0.7",';
        this.userAgent += '"Upgrade-Insecure-Requests":1,';
        this.userAgent += '"Host":"books.toscrape.com"}';

        // Extract path from full URL
        this.url = "/";
        
        // Scrape the property page
        if (!httpRequest.getWithUserAgent(this.userAgent, this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("Book_PageResult_1: [ " + ResultStr + " ]");
        
        system.setStatus(IBXSTATE_ENTER, 30);

        var Results = [];
        var item = {};
        var idx = 1;

        // 다음 페이지 (fixed logic for proper next page navigation)
        while(true) {

            // Reset idx when processing a new page
            idx = 1;

            while(true) {
                var resultBlock = StrGrab(ResultStr, '<article class="product_pod"', '</article>', idx++);
                if (!resultBlock) break;

                item = {};

                // Scrape book details: title, price, availability, image
                item.title = this.Special_Char_Remove(StrGrab(StrGrab(resultBlock, '<h3>', '</h3>'), 'title="', '"'));

                item.price = this.Special_Char_Remove(StrGrab(resultBlock, '<p class="price_color">', '</p>')).trim();

                item.availability = this.Special_Char_Remove(StrGrab(StrGrab(resultBlock, '<p class="instock availability">', '</p>'), '</i>', '')).replace(/[\n\r]/g, '').trim();

                var relativeLink = this.Special_Char_Remove(StrGrab(StrGrab(resultBlock, '<h3>', '</h3>'), 'href="', '"'));
                item.link = relativeLink ? (relativeLink.startsWith('http') ? relativeLink : (this.host + (relativeLink.startsWith('/') ? relativeLink : '/' + relativeLink.replace('../', '')))) : '';

                // Convert star text 'One', 'Two', etc. to number using rate()
                var starText = this.Special_Char_Remove(StrGrab(resultBlock, '<p class="star-rating', '">')).trim();
                item.ratestar = this.rate(starText);

                // Processing Detail Page
                system.setStatus(IBXSTATE_ENTER, 50);
                
                if (relativeLink.indexOf('catalogue') >= 0) { // Detail Page
                    this.url = "/" + relativeLink.replace(/^\//, '');
                }
                else { // Not in 'catalogue', so prepend '/catalogue/'
                    this.url = "/catalogue/" + relativeLink.replace(/^\//, '');
                }

                this.log("DetailPage: [ " + this.host + this.url + " ]");

                if (!httpRequest.getWithUserAgent(this.userAgent, this.host + this.url)) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                var DetailResultStr = httpRequest.result;
                this.log("Book_PageResult_detail: [ " + DetailResultStr + " ]");

                item.detail = {};

                item.detail.quantity = this.Special_Char_Remove(StrGrab(StrGrab(DetailResultStr, '<p class="instock availability">', '</p>'), '</i>', '')).trim();

                item.detail.description = this.Special_Char_Remove(StrGrab(StrGrab(DetailResultStr, '<div id="product_description"', '/p>'), 'p>', '<')).trim();

                // Corrected image extraction and URL handling
                var imageSrc = this.Special_Char_Remove(StrGrab(StrGrab(DetailResultStr, '<div class="thumbnail">', '</div>'), '<img src="', '"')).trim();
                item.detail.image = imageSrc? (imageSrc.startsWith('http') ? imageSrc : ("http://books.toscrape.com/" + imageSrc.replace(/^(\.\.\/)+/, ""))): '';

                // Table Produce Information
                var produceInfo = StrGrab(DetailResultStr, '<table class="table', '</table>');
                if (!produceInfo) {
                    this.setError(E_IBX_SITE_INVALID);
                    return E_IBX_SITE_INVALID;
                }
                
                item.detail.produceInfo = {};

                var idx2 = 1;
                while (true) {
                    var produceInfoRow = StrGrab(produceInfo, '<tr', '</tr>', idx2++);
                    if (!produceInfoRow) break;
                    var th = this.Special_Char_Remove(StrGrab(produceInfoRow, '<th>', '</th>')).trim().toLowerCase();
                    var td = this.Special_Char_Remove(StrGrab(produceInfoRow, '<td>', '</td>')).trim();

                    // Map each field based on its <th> label
                    if (th === "upc") {
                        item.detail.produceInfo.upc_code = td;
                    } else if (th === "product type") {
                        item.detail.produceInfo.product_type = td;
                    } else if (th === "price (excl. tax)") {
                        item.detail.produceInfo.price_excl_tax = td;
                    } else if (th === "price (incl. tax)") {
                        item.detail.produceInfo.price_incl_tax = td;
                    } else if (th === "tax") {
                        item.detail.produceInfo.tax = td;
                    } else if (th === "availability") {
                        item.detail.produceInfo.availability = td;
                        // Try to extract "number_available" from the text as well, fallback to the td if available.
                        var numMatch = td.match(/\((\d+)\s*available\)/i);
                        if (numMatch && numMatch[1]) {
                            item.detail.produceInfo.number_available = numMatch[1];
                        }
                    } else if (th === "number of reviews") {
                        item.detail.produceInfo.number_of_reviews = td;
                    }
                }

                Results.push(item);
            }

            // Find next page
            var nextLi = StrGrab(ResultStr, '<li class="next">', '</li>'); 
            var nextHref = nextLi ? StrGrab(nextLi, 'href="', '"') : "";

            if (nextHref) {
                system.setStatus(IBXSTATE_ENTER, 70);

                // Next page URL
                if (nextHref.indexOf('catalogue') >= 0) { // Detail Page
                    this.url = "/" + nextHref.replace(/^\//, '');
                }
                else { // Not in 'catalogue', so prepend '/catalogue/'
                    this.url = "/catalogue/" + nextHref.replace(/^\//, '');
                }

                if (!httpRequest.getWithUserAgent(this.userAgent, this.host + this.url)) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log("Book_PageResult_next: [ " + ResultStr + " ]");
            } else {
                break;
            }
        }

        if (Results.length == 0) {
            this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
        }

        system.setStatus(IBXSTATE_RESULT, 80);

        // 결과 처리
        this.iSASInOut.Output = {};
        this.iSASInOut.Output.ErrorCode = "00000000";
        this.iSASInOut.Output.ErrorMessage = "";
        this.iSASInOut.Output.Result = Results;

        return S_IBX_OK;
    } catch (e) {
        this.log("exception " + e.message);
        this.setError(E_IBX_UNKNOWN);
        return E_IBX_UNKNOWN;
    } finally {
        system.setStatus(IBXSTATE_DONE, 100);
        this.log(BankName + " BOOKSCRAPEINFO 스크래핑 finally");
    }
};

function OnInit() {
    console.log("OnInit()");
    try {
        //필요한거 로드
        system.include("iSASTypes");
        system.include("sas/sas");
        system.setStatus(IBXSTATE_BEGIN, 0);
    } catch (e) {
        console.log("Exception OnInit:[" + e.message + "]");
    } finally {
    }
};

function Execute(aInput) {
    console.log("Execute[" + aInput + "]");
    try {
        console.log("Init Default Error");
        iSASObj = JSON.parse(aInput);
        iSASObj.Output = {};
        iSASObj.Output.ErrorCode = '8000F110';
        iSASObj.Output.ErrorMessage = "해당 모듈을 실행하는데 실패 했습니다.";

        OnInit();

        iSASObj = JSON.parse(aInput);
        var ClassName = iSASObj.Class;
        var ModuleName = iSASObj.Module;
        if (Failed(SetClassName(ClassName, ModuleName))) {
            iSASObj.Output = {};
            iSASObj.Output.ErrorCode = '8000F111'
            iSASObj.Output.ErrorMessage = "Class명과 Job명을 확인해주시기 바랍니다.";
        } else {
            obj.iSASInOut = "";
            OnExcute(0, JSON.stringify(iSASObj));

            console.log("결과 테스트 [" + obj.iSASInOut + "]");

            if (obj.iSASInOut != "")
                iSASObj = obj.iSASInOut;
        }
    } catch (e) {
        console.log("exception:[" + e.message + "]");
    } finally {
        return JSON.stringify(iSASObj);
    }
};