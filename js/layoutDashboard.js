$(document).ready(function() {

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

});

function calcSchnitt(exams) {
    var noteIns;
    var lpIns;
    exams.forEach(element => {
        noteIns += element.note * element.leistungspunkte;
        lpIns += element.leistungspunkte;
    });
    return noteIns / lpIns;
}