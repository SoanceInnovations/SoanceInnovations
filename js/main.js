  // MAIN JS
  // =================================
  $(function() {
      $(".video").click(function() {
          var theModal = $(this).data("target"),
              videoSRC = $(this).attr("data-video"),
              videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
          $(theModal + ' iframe').attr('src', videoSRCauto);
          $(theModal + ' button.close').click(function() {
              $(theModal + ' iframe').attr('src', videoSRC);
          });
      });
  });
  //pre loader
  $('body').addClass('preloader-running');
  $('.master_wrap').css('visibility', 'hidden');
  $(window).load(function() {
      $("#status").fadeOut(500);
      $("#preloader").delay(500).fadeOut(1000);
      $('body').removeClass('preloader-running');
      $('body').addClass('preloader-done');
      $(".master_wrap").delay(500).css('visibility', 'visible');
  });

  $(document).ready(function() {


      // =======================
      // Scroll homepage arrow
      $('.scrollToBottom>button, .scrollToBottom').bind("click", function() {
          $('html, body').animate({ scrollTop: $('.banner_home').height() - 40 }, 1500);
          return false;
      });

      //=====================================

      $(window).scroll(function() {
          if ($(document).scrollTop() > 80) {
              $(".stick").removeClass('fixed').addClass('fixed_out');
          } else {
              $(".stick").removeClass('fixed_out').addClass('fixed');

          }
      });

      // ====================================


      var textarea = document.querySelector('textarea');
      if (textarea) {
          textarea.addEventListener('keydown', autosize);
      }

      function autosize() {
          var el = this;
          setTimeout(function() {
              el.style.cssText = 'height:auto; padding:0';
              // for box-sizing other than "content-box" use:
              // el.style.cssText = '-moz-box-sizing:content-box';
              el.style.cssText = 'height:' + el.scrollHeight + 'px';
          }, 0);
      }

      // =======================
      $('#back_to_top').click(function() {
          $('html, body').animate({ scrollTop: 0 }, 1500);
          return false;
      });

      //=====================
      // $('.banner_wrp').iosParallax({
      //  movementFactor: 50
      // });

      $('.nav_icon').on('click', function() {
          $(this).toggleClass('active');
      });

      $(".nav_icon").on('click', function() {
          $(".nav_wrap").toggleClass('open');
      });

      $(".mobile_menu").on('click', function() {
          $(".menu_wrp").slideToggle(500);
          $(this).toggleClass('active');
      });

      // =================
      $('.video').parent().click(function() {
          if ($(this).children(".video").get(0).paused) {
              $(this).children(".video").get(0).play();
              $(this).children(".playpause").addClass('play');
          } else {
              $(this).children(".video").get(0).pause();
              $(this).children(".playpause").removeClass('play');
          }
      });
      //==========================
      $('.work_content_left h2 a').hover(function() {
          var value = $(this).data('work_img');
          // alert(value);
          // $(this).html(value);
          $(".work_content_right img").attr('src', value);
      });

      //==========================

      $("#contactForm input").focus(function() {
          $(".form-group > span").removeClass('show');
          $(".form-group").removeClass('error_wrp');
          $(".form-group > input").css("border-color", "#8979b7");
      });

      $(".contact_submit").on('click', function(event) {
          //disable the default form submission


          event.preventDefault();
          //grab all form data
          var name = $("#name").val();
          var email = $("#email").val();
          var message = $("#message").val();
          var purpose = $("#purpose").val();
          var site = $("#site").val();
          var flag = true;


          if (name == '') {
              $("#name").css("border-color", "#f0116a");
              $("#name").parent().addClass("error_wrp");
              $(".error_name").text("Name is required").addClass('show');
              flag = false;
          } else {
              $(".error_name").hide();
          }

          if (email == '') {
              $("#email").css("border-color", "#f0116a");
              $(".error_email").text("Email is required").addClass('show');
              $("#email").parent().addClass("error_wrp");
              flag = false;
          } else {
              $(".error_email").hide();
          }
          if (purpose == '') {
              $("#purpose").css("border-color", "#f0116a");
              $(".error_purpose").text("Add your purpose").addClass('show');
              $("#purpose").parent().addClass("error_wrp");
              flag = false;
          }

          if (!validateEmail(email)) {
              $("#email").css("border-color", "#f0116a");
              $(".error_email").text("Email is required").addClass('show');
              $("#email").parent().addClass("error_wrp");
              flag = false;
          } else {
              $(".error_email").hide();
          }
          //  if (!phonenumber(phone)) {
          //     $("#phone").css("border-color", "red");
          //     flag = false;
          // }

          if (message == '') {
              $("#message").css("border-color", "#f0116a");
              $(".error_message").text("Message is required").addClass('show');
              $("#message").parent().addClass("error_wrp");
              flag = false;
          } else {
              $(".error_message").hide();
          }
          if (flag == 1) {
              $(".loading").show();

              // location.reload();
              $.ajax({
                  type: "POST",
                  url: './sendMail.php',
                  data: { name: name, email: email, message: message, purpose: purpose, site: site, action: "contact" },
                  success: function(res) {
                      if (res == 'success') {
                          sweetAlert({
                              title: "success",
                              text: "Mail has been sucessfully sent",
                              type: "success",
                              confirmButtonText: "Cool"
                          });

                          $('#contactForm')[0].reset();

                      } else {


                      }

                  }


              });


          }


      });

      $("#myfile").on('change', function() {

          var cv = $("#myfile").val();
          if (cv != '') {
              $('.progress').show();
          }
          if (!validate(cv)) {
              $('.progress').hide();
              $(".cv").css("border-color", "#f0116a");
              //alert(1);
              $(".error_cv").text("Please upload a valid format");
              $('.error_cv').delay(1000).fadeOut();
              flag = false;
          }
          var formData = new FormData();
          formData.append('myfile', $('#myfile')[0].files[0]);

          $.ajax({
              url: './fileupload.php',
              data: formData,
              processData: false,
              contentType: false,
              type: 'POST',
              // this part is progress bar
              xhr: function() {
                  var xhr = new window.XMLHttpRequest();
                  xhr.upload.addEventListener("progress", function(evt) {
                      if (evt.lengthComputable) {
                          var percentComplete = evt.loaded / evt.total;
                          percentComplete = parseInt(percentComplete * 100);
                          $('.myprogress').text(percentComplete + '%');
                          $('.myprogress').css('width', percentComplete + '%');
                      }
                  }, false);
                  return xhr;
              },
              success: function(file_name) {

                  $("#file_name").val(file_name);
                  $('.progress').hide();

              }
          });

      });
      //carrer page form
      $(function() {
          $('#btn').click(function() {
              $('.myprogress').css('width', '0');
              $('.msg').text('');
              var name = $('#name').val();
              var phone = $("#phone").val();
              var email = $("#email").val();
              var cover_letter = $("#cover_letter").val();
              var cv = $("#file_name").val();
              // alert(cv);


              var formData = new FormData();

              if (name == '') {
                  $("#name").css("border-color", "#f0116a");
                  $(".error_name").text("Name is required");
                  flag = false;
              } else {
                  $(".error_name").hide();
              }
              if (email == '') {
                  $("#email").css("border-color", "#f0116a");
                  $(".error_email").text("Email is required");
                  flag = false;
              } else {
                  $(".error_email").hide();
              }
              if (phone == '') {
                  $("#phone").css("border-color", "#f0116a");
                  $(".error_phone").text("Add your phone");
                  flag = false;
              }

              if (!validateEmail(email)) {
                  $("#email").css("border-color", "#f0116a");

                  flag = false;
              }
              if (cv == '') {
                  $(".cv").css("border-color", "#f0116a");
                  $(".error_cv").text("CV is required");
                  $('.error_cv').delay(1000).fadeOut();
                  flag = false;
              } else {
                  $(".error_cv").hide();
              }


              //formData.append('myfile', $('#myfile')[0].files[0]);
              formData.append('file_name', cv);
              formData.append('name', name);
              formData.append('phone', phone);
              formData.append('email', email);
              formData.append('cover_letter', cover_letter);

              //$('.msg').text('Uploading in progress...');
              if (name != '' && phone != '' && email != '' && cv != '') {
                  // $('.progress').show();
                  $('#btn').attr('disabled', 'disabled');
                  $.ajax({
                      url: './uploadscript.php',
                      data: formData,
                      processData: false,
                      contentType: false,
                      type: 'POST',

                      success: function(data) {

                          console.log(data);
                          $('.progress').hide();
                          if (data == "success") {
                              sweetAlert({

                                  title: "success",
                                  text: "Mail has been sucessfully sent",
                                  type: "success",
                                  confirmButtonText: "Cool"
                              });
                              $('#carrerForm')[0].reset();
                          }

                      }
                  });
              }
          });
      });

      $('.form-control').on('keyup', function() {
          if ($(this).val() != '') {
              $(this).css("border-color", "#ddd");
              $(this).parent().find('span').hide();
          } else {
              $(this).css("border-color", "#f0116a");
              $(this).parent().find('span').show();
          }
      })

      function validate(file) {
          var ext = file.split(".");

          ext = ext[ext.length - 1].toLowerCase();
          var arrayExtensions = ["pdf", "doc", "docx"];

          if (arrayExtensions.lastIndexOf(ext) == -1) {
              //alert(ext);
              return false;
          } else {
              return true;
          }
      }
      //validation functions
      function validateEmail(email) {
          //testing regular expression

          var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
          //if it's valid email
          if (filter.test(email)) {

              return true;
          } else {
              return false;
          }
      }


      // validation onblur
      function validateFieldcheck(id, val) {
          if (val == "") {

              $("#" + id).css("border-color", "#f0116a");
          } else {

              $("#" + id).css("border-color", "#fff");
              $("#" + id + "_error").text("");

          }
      }

      //         function phonenumber(phone)  
      // {  
      //   var phoneno = /^\d{10}$/;  
      //   if(phoneno.test(phone))  
      //         {  
      //       return true;  
      //         }  
      //       else  
      //         {  

      //         return false;  
      //         }  
      // } 

      $(".work_submit").on('click', function(event) {
          //disable the default form submission


          event.preventDefault();
          //grab all form data
          var name = $("#name").val();
          var email = $("#email").val();
          var message = $("#message").val();
          var flag = true;


          if (name == '') {
              $("#name").css("border-color", "#f0116a");
              $(".error_name").text("Name is required");
              flag = false;
          } else {
              $(".error_name").hide();
          }
          if (email == '') {
              $("#email").css("border-color", "#f0116a");
              $(".error_email").text("Email is required");
              flag = false;
          } else {
              $(".error_email").hide();
          }

          if (!validateEmail(email)) {
              $("#email").css("border-color", "#f0116a");

              flag = false;
          }

          if (message == '') {
              $("#message").css("border-color", "#f0116a");
              $(".error_message").text("Message is required");
              flag = false;
          } else {
              $(".error_message").hide();
          }
          if (flag == 1) {

              $.ajax({
                  type: "POST",
                  url: './sendMail_work.php',
                  data: { name: name, email: email, message: message },
                  success: function(res) {
                      if (res == 'success') {
                          sweetAlert({
                              title: "success",
                              text: "Mail has been sucessfully sent",
                              type: "success",
                              confirmButtonText: "Cool"
                          });

                          $('#work_contactForm')[0].reset();

                      } else {


                      }

                  }


              });

          }


      });
      // ==================
      // alert();



  });
  // ============================================================