$(document).ready(function() {

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

});

$(document).ready(function() {
    var adjustSidebar = function() {
        $(".sidebar").slimScroll({
            height: document.documentElement.clientHeight - $(".navbar").outerHeight()
        });
    };
    $(".sideMenuToggler").on("click", function() {
        $(".wrapper").toggleClass("active");
    })
})