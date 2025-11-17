var BankName = "GrabFood";
var moduleVersion = '25.11.14.1';
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
    console.log(BankName + " GrabFood 생성자 호출");
    this.errorMsg = "";
    this.host = "https://food.grab.com";
    this.apiHost = "https://portal.grab.com";
    this.apiGrab = "https://api.grab.com"
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

VIEW.prototype.RESTAURANTS = function(aInput) {
    this.log(BankName + " RESTAURANTS 스크래핑 호출 [" + aInput + "][" + moduleVersion + "]");
    try {

        system.setStatus(IBXSTATE_ENTER, 10);
        
        this.userAgent = '{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Whale/4.34.340.19 Safari/537.36",';
        this.userAgent += '"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",';
        this.userAgent += '"Upgrade-Insecure-Requests":"1",';
        this.userAgent += '"Accept-Encoding":"gzip, deflate, br, zstd",';
        this.userAgent += '"Accept-Language":"en-US,en;q=0.9,ko;q=0.8,ru;q=0.7"}';

        // URL grab food singapore
        this.url = '/sg/en/restaurants';

        if (!httpRequest.getWithUserAgent(this.userAgent, this.host + this.url)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        var ResultStr = httpRequest.result;
        this.log("MainPageResult: [ " + ResultStr + " ]");

        system.setStatus(IBXSTATE_ENTER, 30);

        var payloadResBlock = StrGrab(ResultStr, '"payload":{', '}');
        if (!payloadResBlock) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        var latlng = StrGrab(payloadResBlock, '"latlng":"', '"');
        var pageSize = StrGrab(payloadResBlock, '"pageSize":', ',');
        var offset = StrGrab(payloadResBlock, '"offset":', ',');

        this.userAgent = JSON.stringify({
            "Host": "portal.grab.com",
            "Connection": "keep-alive",
            "Accept-Language": "en",
            "X-Grab-Web-App-Version": "uaf6yDMWlVv0CaTK5fHdB",
            "X-Hydra-JWT": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnYWEiLCJhdWQiOiJnZnciLCJuYW1lIjoiZ3JhYnRheGkiLCJpYXQiOjE3NjMxMDQ0NjIsImV4cCI6MTc2MzEwNTA2MiwibmJmIjoxNzYzMTA0NDYyLCJ2ZXIiOiIxLjE5LjAuMjQiLCJicklEIjoiNzIwODQ4M2NiMWI3NGJlMjAyZTQxZTM2ZmNjZTY2N2M5MzZ5NnIiLCJzdXMiOmZhbHNlLCJicklEdjIiOiIyN2M4ZGEwZThlMDE3NjI0MWRiMzgxYWI0NjhkODNlNDRjNHk2ciIsImJyVUlEIjoiOTkwMGZiM2UtM2I4NS00ZjExLWEzOTEtY2ZhZGFhZDUzMzk1In0.QU31UHYwc8zvjmoob2OHGnXb0ecyFWi4f0elzOkQEd2MVy0Kkvw-ouozChz8iQrvtmhCpVMZ_QQCIXTwTGsAhEA4mpOav5iWRrOEGOT9eK76b08tgUQkR3936w9soI2Iaknf3MjocGrl7KR_dT1yP0fAMCHikwb8Z2q2Qkkbd4qf_7WuBHKB98eywdvwhmaR5fclYqt2GwQsjjZZ8oGgVaqn60TZSUDxbwKoTmjhDEw7xPScUUlcBbl6WsB5h7ND7q7aTpygUT2W-20HQGhapOBCfwt0uqNS__F5pO1VM_v_xx8ELGzE6R7CxKcoU5MSF8VnJqjWp9Fsu5PMLFGljg",
            "X-GFC-Country": "SG",
            "X-Country-Code": "SG",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            "Referer": "https://food.grab.com/",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Cookie": "passenger_authn_token=eyJhbGciOiJSUzI1NiIsImtpZCI6Il9kZWZhdWx0IiwidHlwIjoiSldUIn0.eyJhbXIiOiJXRUJMT0dJTiIsImF1ZCI6IlNTT19UT0tFTl9JU1NVSU5HX1NFUlZJQ0UiLCJleHAiOjE3NjU2OTUwMzMsImdyb3VwIjoiR1VFU1QiLCJpYXQiOjE3NjMxMDMwMzAsImp0aSI6IjJlMzZlNDRkLWI2M2YtNDgzNC05OTY2LWIwMDI1OTRjMmY0NiIsInN1YiI6IkcwMS1hU3N2TWtGNmVXZE1UV1VyUmxCdVZsa3ZaRGxsVVQwOSIsInN2YyI6IlBBU1NFTkdFUiJ9.KzCXEMDCtXbdVThyx0YCVdh7NewpMqXCzrL3O51RAAvq1kEbYOOfAGvUs-xqL-vBQKqkgD6JPyCECKwcG7qc3wnmAGAV3HwP950ReNlnyX3-wELSOGWV0QFJBKgrsTBP1BtSqJ8nvnDVX0AcgxxoqQ4ANspmS4gKTMf_FcqdU_ZPKxdYhQf6cXk_cZ_QMu0d-_fnEBKJHZb91Onwfw2Osgrc8Dp-MZGE5cJyGfk1DNYRmMKWda-hNPrdSwlU7TQRtYgqPOphv2xwniq62w4ReCtv9XSKEoNisKVZehomBa5rtk-WZY97XeYlROkZoA_7RFlqxaGj5vvvxGzfYnSdMA"
        });

        this.url = '/foodweb/guest/v2/search';

        this.postData = '{"latlng":"' + latlng + '","keyword":"","offset":' + offset + ',"pageSize":' + pageSize + ',"countryCode":"SG"}';

        if (!httpRequest.postWithUserAgent(this.userAgent, this.apiHost + this.url, this.postData)) {
            this.setError(E_IBX_FAILTOGETPAGE);
            return E_IBX_FAILTOGETPAGE;
        }
        ResultStr = httpRequest.result;
        this.log("RestaurantsPageResult: [ " + ResultStr + " ]");
        
        system.setStatus(IBXSTATE_ENTER, 45);

        // JSON Parse Result
        var resultJson = {};
        try {
            resultJson = JSON.parse(ResultStr).searchResult;
        } catch (e) {
            this.setError(E_IBX_SITE_INVALID);
            return E_IBX_SITE_INVALID;
        }

        var Results = [];

        // hasMore=True next page (scroll page load)
        while (true) {

            if (resultJson && resultJson.searchMerchants && resultJson.searchMerchants.length > 0) {
                for (var i = 0; i < resultJson.searchMerchants.length; i++) {
                    var merchant = resultJson.searchMerchants[i];
                    var brief = merchant.merchantBrief || {};
                    Results.push({
                        id: merchant.id,
                        name: (merchant.address && merchant.address.name) ? merchant.address.name : "",
                        cuisine: brief.cuisine || [],
                        distanceInKm: brief.distanceInKm || null,
                        rating: brief.rating || null,
                        voteCount: brief.vote_count || null,
                        photo: brief.photoHref || "",
                        address: merchant.address || {},
                        openHours: brief.openHours || {},
                        status: (merchant.merchantStatusInfo && merchant.merchantStatusInfo.status) ? merchant.merchantStatusInfo.status : "",
                        promo: brief.promo || {},
                        deliverBy: brief.deliverBy || "",
                        priceTag: brief.priceTag || null
                    });
                }
            }

            var hasMore = resultJson.hasMore;
            if (hasMore) {
                this.postData = '{"latlng":"' + latlng + '","keyword":"","offset":' + resultJson.offset + ',"pageSize":' + pageSize + ',"countryCode":"SG"}';
                if (!httpRequest.postWithUserAgent(this.userAgent, this.apiHost + this.url, this.postData)) {
                    this.setError(E_IBX_FAILTOGETPAGE);
                    return E_IBX_FAILTOGETPAGE;
                }
                ResultStr = httpRequest.result;
                this.log("RestaurantsPageResult: [ " + ResultStr + " ]");

                // JSON Parse Result
                var resultJson = {};
                try {
                    resultJson = JSON.parse(ResultStr).searchResult;
                } catch (e) {
                    this.setError(E_IBX_SITE_INVALID);
                    return E_IBX_SITE_INVALID;
                }

            } else {
                break;
            }
        }

        system.setStatus(IBXSTATE_RESULT, 80);

        if (Results.length == 0) {
            this.setError(I_IBX_RESULT_NOTPRESENT);
            return I_IBX_RESULT_NOTPRESENT;
        }

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