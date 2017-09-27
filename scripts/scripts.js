var data;

var activeData = [];
var filters = [];

var filterClick = function (control, data) {
    var index = -1;
    if ($(control).data("type") == "subject") { index = filters.findIndex(function(obj) { return obj.tag == data; }); }
    else if ($(control).data("type") == "os") { index = filters.findIndex(function(obj) { return obj.os == data; }); }
    filters[index].checked = control.checked;

    buildList();
};

function buildList() {
    $('#courses').empty();

    var checked = $.grep(filters, function(n) { return n.checked; });
    if (checked.length > 0) {
        // get checked for each filter type
        var tags = $.grep(checked, function(n) { return n.tag != undefined; });
        var oses = $.grep(checked, function(n) { return n.os != undefined; });

        // compare both
        if (tags.length > 0 && oses.length > 0) {
            $.each(activeData, function(i, v) {
                if (containsObjs(v.tags, 'tags') && containsObjs(v.os, 'os'))
                    createElement(v);
            });
        }
        // check if just tags checked
        else if (oses.length == 0) {
            $.each(activeData, function(i, v) {
                if (containsObjs(v.tags, 'tags'))
                    createElement(v);
            });
        }
        // check if just os checked
        else if (tags.length == 0) {
            $.each(activeData, function(i, v) {
                if (containsObjs(v.os, 'os'))
                    createElement(v);
            });
        }
    }
    else {
        $.each(activeData, function(i, v) {
            createElement(v);
        });
    }
}

function containsObjs(objs, type) {
    var checked = undefined;
    if (type == "tags")
        checked = $.grep(filters, function(n) { return n.checked; }).map(function (f) { return f.tag; });
    else if (type == "os")
        checked = $.grep(filters, function(n) { return n.checked; }).map(function (f) { return f.os; });

    var match = false;

    $.each(objs, function(i, v) {
        if (checked.indexOf(v) != -1)
            match = true;
    })

    return match;
}

function createElement(course) {
    var div = $('<div class="course"></div>').html(
        '<div class="image"><img src="//cdn.rawgit.com/AzureWorkshops/images/master/logos/' + course.image + '" /></div>' +
        (course.url != undefined ? '<div class="cdesc"><h3><a href="' + course.url + '">' + course.title + '</a></h3>' : '<div class="cdesc"><h3>' + course.title + '</h3>') +
        course.description)

    if (course.links != undefined) {
        var links = '';

        $.each(course.links, function(i, link) {
            links += '<a href="' + link.url + '"><img src="//cdn.rawgit.com/AzureWorkshops/images/master/logos/' + link.icon + '" /> ' + link.description + '</a>';
        });

        links = $('<div class="links"></div>').html(links);
        $(div).find('.cdesc').append(links);
    }

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
    $.getJSON('//raw.githubusercontent.com/AzureWorkshops/AzureWorkshops.github.io/master/workshops.json', function(resp) {
        data = resp;
    }).then(function() {
        activeData = $.grep(data, function(n) { return n.active; });

        // Get only active tags
        $.each(activeData, function(i, v) {
            $.each(v.tags, function(j, k) {
                if ($.grep(filters, function(e) { return e.tag == k; }).length === 0)
                    filters.push({ "tag": k, "checked": false });
            });
            $.each(v.os, (j, k) => {
                if ($.grep(filters, function(e) { return e.os == k; }).length === 0)
                    filters.push({ "os": k, "checked": false });
            });
        });


        // Add filter options
        $.each(filters, function(i, v) {
            if (v.tag != undefined) {
                addOption(v.tag, 'subject');
            }
            else if (v.os != undefined) {
                addOption(v.os, 'os');
            }
        });

        buildList();
    });
});
