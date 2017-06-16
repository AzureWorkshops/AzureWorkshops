var data = $.getJSON('http://raw.githubusercontent.com/AzureWorkshops/AzureWorkshops.github.io/master/workshops.json');

var activeData = [];
var filters = [];

var filterClick = function (control, data) {
    var index = -1;
    if ($(control).data("type") == "subject") { index = filters.findIndex((obj) => obj.tag == data); }
    else if ($(control).data("type") == "os") { index = filters.findIndex((obj) => obj.os == data); }
    filters[index].checked = control.checked;

    buildList();
};

function buildList() {
    $('#courses').empty();

    var checked = $.grep(filters, (n) => { return n.checked; });
    if (checked.length > 0) {
        // get checked for each filter type
        var tags = $.grep(checked, (n) => { return n.tag != undefined; });
        var oses = $.grep(checked, (n) => { return n.os != undefined; });

        // compare both
        if (tags.length > 0 && oses.length > 0) {
            $.each(activeData, (i, v) => {
                if (containsObjs(v.tags, 'tags') && containsObjs(v.os, 'os'))
                    createElement(v);
            });
        }
        // check if just tags checked
        else if (oses.length == 0) {
            $.each(activeData, (i, v) => {
                if (containsObjs(v.tags, 'tags'))
                    createElement(v);
            });
        }
        // check if just os checked
        else if (tags.length == 0) {
            $.each(activeData, (i, v) => {
                if (containsObjs(v.os, 'os'))
                    createElement(v);
            });
        }
    }
    else {
        $.each(activeData, (i, v) => {
            createElement(v);
        });
    }
}

function containsObjs(objs, type) {
    var checked = undefined;
    if (type == "tags")
        checked = $.grep(filters, (n) => { return n.checked; }).map(function (f) { return f.tag; });
    else if (type == "os")
        checked = $.grep(filters, (n) => { return n.checked; }).map(function (f) { return f.os; });

    var match = false;

    $.each(objs, (i, v) => {
        if (checked.indexOf(v) != -1)
            match = true;
    })

    return match;
}

function createElement(course) {
    var div = $('<div class="course"></div>').html(
        '<div class="image"><img src="http://raw.githubusercontent.com/AzureWorkshops/images/master/logos/' + course.image + '" /></div>' +
        '<div class="cdesc"><h3><a href="' + course.url + '">' + course.title + '</a></h3>' +
        course.description);
    $('#courses').append(div);
}

function addOption(item, list) {
    var normalized = item.replace(/ /g, '_');
    var option =
        '<div class="checkbox checkbox-primary">' +
        '<input id="' + normalized + '" type="checkbox" class="styled" data-type="' + list + '" onClick="filterClick(this, \'' + item + '\');" />' +
        '<label for="' + normalized + '">' + item + '</label>' +
        '</div>';

    $('#filter-options-' + list).append(option);
}

$(document).ready(function () {
    activeData = $.grep(data, (n) => { return n.active; });

    // Get only active tags
    $.each(activeData, (i, v) => {
        $.each(v.tags, (j, k) => {
            if ($.grep(filters, (e) => { return e.tag == k; }).length === 0)
                filters.push({ "tag": k, "checked": false });
        });
        $.each(v.os, (j, k) => {
            if ($.grep(filters, (e) => { return e.os == k; }).length === 0)
                filters.push({ "os": k, "checked": false });
        });
    });


    // Add filter options
    $.each(filters, (i, v) => {
        if (v.tag != undefined) {
            addOption(v.tag, 'subject');
        }
        else if (v.os != undefined) {
            addOption(v.os, 'os');
        }
    });

    buildList();
});