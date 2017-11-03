$(document).ready(function() {

    //Edit Student Button Clicked
    $('#edit-btn').on('click', function(e) {
        var studentId = e.currentTarget.getAttribute("data-id");
        $.ajax({
            type: 'GET',
            url: '/studentview/edit/' + studentId,
            success: function(data) {
                window.location.href = '/studentview/edit/' + studentId;
            }
        });
    });

    //Add Student Button Clicked
    $('#add-student').on('click', function() {
        $.ajax({
            type: 'GET',
            url: '/student/add',
            success: function(data) {
                window.location.href = '/student/add';
            }
        });
    });

    //Delete Student Button Clicked
    $('#delete-btn').on('click', function(e) {
        
        $('#exampleModal').on('show.bs.modal', function (e) {
            var studentId = e.currentTarget.getAttribute("data-id");
            $('button#delete-btn-home').on('click', function() {
                
                $.ajax({
                    type: 'DELETE',
                    url: '/studentview/' + studentId,
                    success: function(data){
                    //do something with the data via front-end framework
                    window.location.href = '/';
                }
                });
            });
        });
    });

    // Deleting from HomePage
   $('#exampleModal').on('show.bs.modal', function (e) {
      var selectedStudentId = e.relatedTarget.getAttribute("data-id");
      $('button#delete-btn-home').on('click', function() {
          
          $.ajax({
            type: 'DELETE',
            url: '/studentview/' + selectedStudentId,
            success: function(data){
            //do something with the data via front-end framework
            window.location.href = '/';
          }
        });
      });
    });

    $('#back-btn').on('click', function() {
        $.ajax({
            success: function(responce) {
                window.location.href = '/';            
            }
        });
    });


});
