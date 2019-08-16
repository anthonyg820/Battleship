
//Get the height and width of the user's browser
var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

function setContentWrapperSize()
{
    var contentWrapper = document.getElementById("content-wrapper");
    contentWrapper.style.width = screenWidth + "px";
    contentWrapper.style.height = screenHeight + "px";
}