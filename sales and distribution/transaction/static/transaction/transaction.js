$(document).ready(function(){
	var arr = [];
	var count = 1;
	var edit_id;
	var price = 0;
	var quantity;
	var amount;
	var total = 0
	var grand = 0;
	var new_total_amount = 0;
	var value_of_goods;
	var sales_tax;
	var sum = 0;
	var cartage_amount;
	var additional_tax;
	var withholding_tax;
	var tax;


	$(".has_id").click(function(){
			 edit_id = this.id;
		});

	function getCookie(c_name)
	{
			if (document.cookie.length > 0)
			{
					c_start = document.cookie.indexOf(c_name + "=");
					if (c_start != -1)
					{
							c_start = c_start + c_name.length + 1;
							c_end = document.cookie.indexOf(";", c_start);
							if (c_end == -1) c_end = document.cookie.length;
							return unescape(document.cookie.substring(c_start,c_end));
					}
			}
			return "";
	 }

	 	 					$(".add-item-purchase").click(function(){
	 	 						var item_code_purchase = $('#item_code_purchase').val();

	 	 							req =	$.ajax({
	 	 								 headers: { "X-CSRFToken": getCookie("csrftoken") },
	 	 								 type: 'POST',
	 	 								 url : '/transaction/purchase/new/',
	 	 								 data:{
	 	 									 'item_code_purchase': item_code_purchase,
	 	 								 },
	 	 								 dataType: 'json'
	 	 							 })
	 	 							 .done(function done(data){
	 									 type = JSON.parse(data.items)

	 	 								var index = $("table tbody tr:last-child").index();
	 	 										var row = '<tr>' +
	 	 												'<td>'+count+'</td>' +
	 	 												'<td>'+type[0].fields['item_code']+'</td>'+
	 	 												'<td>'+type[0].fields['item_name']+'</td>'+
	 	 												'<td><pre>'+type[0].fields['item_description']+'</pre></td>'+
	 	 												'<td ><select id="sel" class="form-control" style="height:40px;"><option>sq.ft</option><option>sq.inches</option></select></td>' +
	 	 												'<td id="width"><input type="text"  class="form-control"></td>'+
	 	 												'<td id="height"><input type="text"  class="form-control"></td>'+
	 	 												'<td id="quantity"><input type="text"  class="form-control"></td>'+
	 	 												'<td id="square_fit"></td>'+
	 	 												'<td id="rate" ><input type="text" style="width:70px;" class="form-control"></td>' +
	 	 												'<td id="total" style="font-weight:bold;" class="sum"><b>0.00</b></td>' +
	 													'<td style="display:none;" id="measurment"></td>' +
	 	 									'<td><a class="add-transaction-purchase" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-transaction-purchase" title="Edit" data-toggle="tooltip" id="edit_purchase"><i class="material-icons">&#xE254;</i></a><a class="delete-transaction-purchase" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
	 	 										'</tr>';
	 	 										count++;
	 	 									$("table").append(row);
	 	 								$("table tbody tr").eq(index + 1).find(".edit-transaction-purchase, .add-transaction-purchase").toggle();
	 	 										$('[data-toggle="tooltip"]').tooltip();
	 	 										$('#item_code_sale').val("");

	 	 							 });
	 	 					});

	 	 					// Add row on add button click
	 	 					$(document).on("click", ".add-transaction-purchase", function(){
	 	 						sum = 0;

	 	 							var empty = false;
	 	 							var input = $(this).parents("tr").find('input[type="text"]');
	 	 									input.each(function(){
	 	 								if(!$(this).val()){
	 	 									$(this).addClass("error");
	 	 									empty = true;
	 	 								}
	 	 								else{
	 	 										$(this).removeClass("error");
	 	 										}

	 	 							});

	 	 						$(this).parents("tr").find(".error").first().focus();
	 	 						if(!empty){
	 	 							input.each(function(){
	 	 								$(this).parent("td").html($(this).val());
	 	 							});
	 	 							$(this).parents("tr").find(".add-transaction-purchase, .edit-transaction-purchase").toggle();
	 	 							$(".add-item-purchase").removeAttr("disabled");
	 	 						}

	 					var meas;
	 							$('#new-purchase-table tbody tr').each(function() {
	 									var tdObject = $(this).find('td:eq(4)'); //locate the <td> holding select;
	 									var selectObject = tdObject.find("select"); //grab the <select> tag assuming that there will be only single select box within that <td>
	 									meas = selectObject.val(); // get the selected country from current <tr>
	 						});

	 					var get_height = $($(this).parents("tr").find("#height")).filter(function() {
	 									height = $(this).text();
	 									return height
	 							}).closest("tr");

	 					var get_width = $($(this).parents("tr").find("#width")).filter(function() {
	 									width = $(this).text();
	 									return width
	 							}).closest("tr");


	 					var get_quantity = $($(this).parents("tr").find("#quantity")).filter(function() {
	 									quantity = $(this).text();
	 									return quantity
	 							}).closest("tr");

	 							console.log(meas);
	 					if (meas === "sq.ft") {
	 						square_fit = parseFloat(width) * parseFloat(height);
	 						square_fit = square_fit * parseFloat(quantity)
	 						var set_square_fit = $($(this).parents("tr").find("#square_fit")).filter(function() {
	 										$(this).text(square_fit.toFixed(2));
	 										return square_fit
	 								}).closest("tr");
	 						var get_meas = $($(this).parents("tr").find("#measurment")).filter(function() {
	 										meas = $(this).text("sq.ft");
	 										return meas
	 								}).closest("tr");
	 					}
	 					else if (meas === "sq.inches") {
	 						square_fit = parseFloat(width) * parseFloat(height)
	 						square_fit = square_fit / 144
	 						square_fit = square_fit * parseFloat(quantity)
	 						var set_square_fit = $($(this).parents("tr").find("#square_fit")).filter(function() {
	 										$(this).text(square_fit.toFixed(2));
	 										return square_fit
	 								}).closest("tr");
	 						var get_meas = $($(this).parents("tr").find("#measurment")).filter(function() {
	 										meas = $(this).text("sq.inches");
	 										return meas
	 								}).closest("tr");
	 					}

	 	 				  var get_sqft = $($(this).parents("tr").find("#square_fit")).filter(function() {
	 	 								sqft = $(this).text();
	 	 								return sqft;
	 	 						}).closest("tr");

	 	 					var get_rate = $($(this).parents("tr").find("#rate")).filter(function() {
	 	 									rate = $(this).text();
	 	 									return rate;
	 	 							}).closest("tr");


	 	 					total = parseFloat(sqft) * parseFloat(rate)

	 	 					var get_total = $($(this).parents("tr").find("#total")).filter(function() {
	 	 									total = $(this).text(total.toFixed(2));
	 	 									return total;
	 	 							}).closest("tr");

	 	 					});

	 	 								// Edit row on edit button click
	 	 				$(document).on("click", ".edit-transaction-purchase", function(){
	 	 						$(this).parents("tr").find("td:not(:last-child)").each(function(i){
	 								if (i === 5) {
	 									 $(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
	 								}
	 								if (i === 6) {
	 									 $(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
	 								}
	 								if (i === 7) {
	 									 $(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
	 								}
	 	 								if (i === 9) {
	 	 									 $(this).html('<input type="text" style="width:80px;" class="form-control" value="' + $(this).text() + '">');
	 	 								}

	 	 					});
	 	 					$(this).parents("tr").find(".add-transaction-purchase, .edit-transaction-purchase").toggle();
	 	 					$(".add-item-purchase").attr("disabled", "disabled");
	 	 					});

	 	 					// Delete row on delete button click
	 	 					$(document).on("click", ".delete-transaction-purchase", function(){
	 	 						var row =  $(this).closest('tr');
	 	 						var siblings = row.siblings();
	 	 						siblings.each(function(index) {
	 	 						$(this).children('td').first().text(index + 1);
	 	 						});
	 	 						$(this).parents("tr").remove();
	 	 						$(".add-item-purchase").removeAttr("disabled");
	 	 					});




	 	 			$('#new-purchase-submit').on('submit',function(e){
	 	 				e.preventDefault();
	 	 				var table = $('#new-purchase-table');
	 	 				var data = [];
	 	 				var purchase_id = $('#purchase_id').val();
	 	 				var follow_up = $('#follow_up').val();
	 	 				var vendor = $('#vendor').val();
	 	 				var payment_method = $('#payment_method').val();
	 	 				var footer_desc = $('#footer_desc').val();


	 	 				table.find('tr').each(function (i, el){
	 	 					if(i != 0)
	 	 					{
	 	 						var $tds = $(this).find('td');
	 	 						var row = {
	 	 							'item_code' : "",
	 	 							'width' : "",
	 	 							'height' : "",
	 	 							'quantity' : "",
	 	 							'rate' : "",
	 	 							'total': "",
	 	 							'measurment' : "",
	 	 						};
	 	 						$tds.each(function(i, el){
	 	 							if (i === 1) {
	 	 									row["item_code"] = ($(this).text());
	 	 							}
	 	 							else if (i === 5) {
	 	 									row["width"] = ($(this).text());
	 	 							}
	 	 							else if (i === 6) {
	 	 									row["height"] = ($(this).text());
	 	 							}
	 	 							else if (i === 7) {
	 	 									row["quantity"] = ($(this).text());
	 	 							}
	 	 							else if (i === 9) {
	 	 									row["rate"] = ($(this).text());
	 	 							}
	 	 							else if (i === 10) {
	 	 									row["total"] = ($(this).text());
	 	 							}
	 	 							else if (i === 11) {
	 	 									row["measurment"] = ($(this).text());
	 	 							}
	 	 						});
	 	 						data.push(row);
	 	 					}
	 	 				});

	 	 					 req =	$.ajax({
	 	 							headers: { "X-CSRFToken": getCookie("csrftoken") },
	 	 							type: 'POST',
	 	 							url : '/transaction/purchase/new/',
	 	 							data:{
	 	 								'purchase_id': purchase_id,
	 	 								'vendor': vendor,
	 	 								'follow_up': follow_up,
	 	 								'payment_method': payment_method,
	 	 								'footer_desc': footer_desc,
	 	 								'items': JSON.stringify(data),
	 	 							},
	 	 							dataType: 'json'
	 	 						})
	 	 						.done(function done(){
	 	 							alert("Purchase Created");
	 	 							location.reload();
	 	 						})
	 	 			});

// =================================================================================


	$(".add-item-purchase-edit").click(function(){
		console.log("click");
		var item_code_purchase = $('#item_code_purchase_edit').val();
		console.log(item_code_purchase);
		req =	$.ajax({
			 headers: { "X-CSRFToken": getCookie("csrftoken") },
			 type: 'POST',
			 url : `/transaction/purchase/edit/${edit_id}`,
			 data:{
				 'item_code_purchase': item_code_purchase,
			 },
			 dataType: 'json'
		 })
		 .done(function done(data){
			 var type = JSON.parse(data.row);
			 var index = $("table tbody tr:last-child").index();
			 total_amount = (type[0].fields['unit_price'] * type[0].fields['quantity']);
					 var row = '<tr>' +
							 '<td>'+count+'</td>' +
							 '<td>'+ type[0].fields['product_code'] +'</td>' +
							 '<td>'+ type[0].fields['product_name'] +'</td>' +
							 '<td id="desc" >'+ type[0].fields['product_desc'] +'</td>' +
							 '<td id="quantity_edit" ><input type="text" class="form-control" value=""></td>' +
							 '<td><input type="text" class="form-control" value=""></td>' +
							 '<td id="price_edit" ><input type="text" class="form-control" value=""></td>' +
							 '<td id="value_of_goods_edit" >0.00</td>' +
							 '<td id="sales_tax_edit"><input type="text" class="form-control" value=""></td>' +
							 '<td id="sales_tax_amount_edit">0.00</td>' +
				 '<td><a class="add-transaction-edit" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-transaction-edit" title="Edit" data-toggle="tooltip" id="edit_purchase"><i class="material-icons">&#xE254;</i></a><a class="delete-transaction-edit" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
					 '</tr>';
					 count++;
				 $("table").append(row);
			 $("table tbody tr").eq(index + 1).find(".add-transaction-edit, .edit-transaction-edit").toggle();
					 $('[data-toggle="tooltip"]').tooltip();
		 });
	});


	// Add row on add button click
	$(document).on("click", ".add-transaction-edit", function(){
	sum = 0;
	var empty = false;
	var input = $(this).parents("tr").find('input[type="text"]');
			input.each(function(){
		if(!$(this).val()){
			$(this).addClass("error");
			empty = true;
		}
		else{
				$(this).removeClass("error");
				}
	});
	$(this).parents("tr").find(".error").first().focus();
	if(!empty){
		input.each(function(){
			$(this).parent("td").html($(this).val());
		});
		$(this).parents("tr").find(".add-transaction-edit, .edit-transaction-edit").toggle();
		$(".add-item-purchase").removeAttr("disabled");
	}
	console.log($(this));
	var get_price = $($(this).parents("tr").find("#price_edit")).filter(function() {
					price = $(this).text();
					console.log(price);
					return price
			}).closest("tr");

	var get_quantity = $($(this).parents("tr").find("#quantity_edit")).filter(function() {
					quantity = $(this).text();
					return quantity
			}).closest("tr");
			console.log(quantity);
	var set_valueOfGoods = $($(this).parents("tr").find("#value_of_goods_edit")).filter(function() {
					value_of_goods =  quantity * price
					$(this).text(value_of_goods.toFixed(2))
					return value_of_goods;
			}).closest("tr");

	var get_salesTax = $($(this).parents("tr").find("#sales_tax_edit")).filter(function() {
					sales_tax = value_of_goods * $(this).text();
					sales_tax = sales_tax / 100
					return sales_tax;
			}).closest("tr");

	var set_salesTax = $($(this).parents("tr").find("#sales_tax_amount_edit")).filter(function() {
					$(this).text(sales_tax.toFixed(2));
					return sales_tax;
			}).closest("tr");

	var set_total = $($(this).parents("tr").find("#total")).filter(function() {
					total = value_of_goods + sales_tax
					$(this).text(total.toFixed(2));
					return sales_tax;
			}).closest("tr");

			$($(this).parents("tr").find("#total")).each(function() {
					var value = $(this).text();
					// add only if the value is number
					if(!isNaN(value) && value.length != 0) {
							console.log(value);
					}
		});

		$('#new-purchase-table > tbody  > tr').each(function() {
			 sum = sum + parseFloat($(this).find('td#total').text());
		});

	cartage_amount =	$('#cartage_amount').val();
	additional_tax = $('#additional_tax').val();
	console.log(sum);
	grand = parseFloat(cartage_amount) + parseFloat(additional_tax) + sum;
	$('#last_grand_total').val(grand.toFixed(2));

	});

				// Edit row on edit button click
$(document).on("click", ".edit-transaction-edit", function(){
		$(this).parents("tr").find("td:not(:last-child)").each(function(i){
				if (i === 3) {
					$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
				}
				if (i === 4) {
					$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
				}
				if (i === 5) {
					 $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
				}
				if (i === 8) {
					 $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
				}

	});
	$(this).parents("tr").find(".add-transaction-edit, .edit-transaction-edit").toggle();
	$(".add-item-purchase").attr("disabled", "disabled");
	});

	// Delete row on delete button click
	$(document).on("click", ".delete-transaction-edit", function(){
		var row =  $(this).closest('tr');
		var siblings = row.siblings();
		siblings.each(function(index) {
		$(this).children('td').first().text(index + 1);
		});
		$(this).parents("tr").remove();
		$(".add-new-rfq-customer").removeAttr("disabled");
	});

$('#cartage_amount').on('keyup',function(e){
var i = this.value;
var at = $('#additional_tax').val()
if(!isNaN(i) && i.length != 0){
		if (!isNaN(at)) {
				var a =  sum
				var v =  parseFloat(a) + parseFloat(i) + parseFloat(at)
				$('#last_grand_total').val(v.toFixed(2));
		}
		else {
				var a =  sum
				var v =  parseFloat(a) + parseFloat(i)
				$('#last_grand_total').val(v.toFixed(2));
		}
}
else {
	if (!isNaN(at)) {
		sum = parseFloat(at) + sum;
		$('#last_grand_total').val(sum.toFixed(2));
	}
	else {
		$('#last_grand_total').val(sum);
	}
}
});

$('#additional_tax').on('keyup',function(){
var i = this.value;
var ac = $('#cartage_amount').val()
if(!isNaN(i) && i.length != 0){
		if (!isNaN(ac)) {
				var a =  sum
				var v =  parseFloat(a) + parseFloat(i) + parseFloat(ac)
				$('#last_grand_total').val(v.toFixed(2));
		}
		else {
				var a =  sum
				var v =  parseFloat(a) + parseFloat(i)
				$('#last_grand_total').val(v.toFixed(2));
		}
}
else {
	if (!isNaN(ac)) {
		sum = parseFloat(ac) + sum;
		$('#last_grand_total').val(sum.toFixed(2));
	}
	else {
		$('#last_grand_total').val(sum);
	}
}

})


$('#withholding_tax').on('keyup',function(){
var i = this.value;
var cartage_amount = parseFloat($('#cartage_amount').val());
var additional_tax = parseFloat($('#additional_tax').val());
var grand_total = parseFloat(sum);
var a =  cartage_amount + additional_tax + grand_total;
console.log(a);
var withholding_tax =  a.toFixed(2) * i;
withholding_tax = withholding_tax / 100;
var amount =  withholding_tax + cartage_amount + additional_tax +  grand_total
$('#last_grand_total').val(amount.toFixed(2));
})


		//EDIT PURCHASE END

	$('#edit-purchase-submit').on('submit',function(e){
		e.preventDefault();
		var table = $('#edit-purchase-table');
		var data = [];
		var purchase_id = $('#purchase_id').val();
		var supplier = $('#supplier_name_purchase').val();
		var payment_method = $('#payment_method').val();
		var footer_desc = $('#footer_desc').val();
		console.log(footer_desc);

		var cartage_amount = $('#cartage_amount').val();
		var additional_tax = $('#additional_tax').val();
		var withholding_tax = $('#withholding_tax').val();


		table.find('tr').each(function (i, el){
			if(i != 0)
			{
				var $tds = $(this).find('td');
				var row = {
					'item_code' : "",
					'item_name' : "",
					'item_description' : "",
					'quantity' : "",
					'unit' : "",
					'price' : "",
					'sales_tax' : "",
				};
				$tds.each(function(i, el){
					if (i === 1) {
							row["item_code"] = ($(this).text());
					}
					if (i === 2) {
							row["item_name"] = ($(this).text());
					}
					else if (i === 3) {
							row["item_description"] = ($(this).text());
					}
					else if (i === 4) {
							row["quantity"] = ($(this).text());
					}
					else if (i === 5) {
							row["unit"] = ($(this).text());
					}
					else if (i === 6) {
							row["price"] = ($(this).text());
					}
					else if (i === 8) {
							row["sales_tax"] = ($(this).text());
					}
				});
				data.push(row);
			}
		});

			 req =	$.ajax({
					headers: { "X-CSRFToken": getCookie("csrftoken") },
					type: 'POST',
					url : `/transaction/purchase/edit/${edit_id}`,
					data:{
						'purchase_id': purchase_id,
						'supplier': supplier,
						'payment_method': payment_method,
						'footer_desc': footer_desc,
						'cartage_amount': cartage_amount,
						'additional_tax':additional_tax,
						'withholding_tax':withholding_tax,
						'items': JSON.stringify(data),
					},
					dataType: 'json'
				})
				.done(function done(){
					alert("Purchase Updated");
					location.reload();
				})
	});

// =============================================================================


$('#edit-purchase-return-submit').on('submit',function(e){
	e.preventDefault();
	var table = $('#new-purchase-return-table');
	var data = [];
	var purchase_id = $('#purchase_return_id').val();
	var supplier = $('#supplier_purchase_return_name').val();
	var payment_method = $('#payment_method').val();
	var footer_desc = $('#desc_purchase_return').val();


	table.find('tr').each(function (i, el){
		if(i != 0)
		{
			var $tds = $(this).find('td');
			var row = {
				'item_code' : "",
				'item_name' : "",
				'item_description' : "",
				'quantity' : "",
				'unit' : "",
				'price' : "",
				'sales_tax' : "",
			};
			$tds.each(function(i, el){
				if (i === 1) {
						row["item_code"] = ($(this).text());
				}
				if (i === 2) {
						row["item_name"] = ($(this).text());
				}
				else if (i === 3) {
						row["item_description"] = ($(this).text());
				}
				else if (i === 4) {
						row["quantity"] = ($(this).text());
				}
				else if (i === 5) {
						row["unit"] = ($(this).text());
				}
				else if (i === 6) {
						row["price"] = ($(this).text());
				}
				else if (i === 7) {
						row["sales_tax"] = ($(this).text());
				}
			});
			data.push(row);
		}
	});

		 req =	$.ajax({
				headers: { "X-CSRFToken": getCookie("csrftoken") },
				type: 'POST',
				url : `/transaction/purchase/return/edit/${edit_id}`,
				data:{
					'purchase_id': purchase_id,
					'supplier': supplier,
					'payment_method': payment_method,
					'footer_desc': footer_desc,
					'items': JSON.stringify(data),
				},
				dataType: 'json'
			})
			.done(function done(){
				alert("Purchase Return Updated");
				location.reload();
			})
});


// =============================================================================
				$(".add-item-sale").click(function(){
				var job_no_sale = "";
				var job_no_sale = $('#job_no_sale').val();

					req =	$.ajax({
						 headers: { "X-CSRFToken": getCookie("csrftoken") },
						 type: 'POST',
						 url : '/transaction/sale/new/',
						 data:{
							 'job_no_sale': job_no_sale,
						 },
						 dataType: 'json'
					 })
					 .done(function done(data){
						 console.log(data.items);

					for (var i = 0; i < data.items.length; i++) {
						if (data.items[i][3] == "sq.ft") {
							square_fit = parseFloat(data.items[i][4]) * parseFloat(data.items[i][5])
							square_fit = square_fit * parseFloat(data.items[i][6])
						}
						else if (data.items[i][3] == "sq.inches") {
							square_fit = parseFloat(data.items[i][4]) * parseFloat(data.items[i][5])
							square_fit = square_fit / 144
							square_fit = square_fit * parseFloat(data.items[i][6])
						}
						var index = $("table tbody tr:last-child").index();
								var row = '<tr>' +
										'<td>'+count+'</td>' +
										'<td>'+data.items[i][0]+'</td>'+
										'<td>'+data.items[i][1]+'</td>'+
										'<td><pre>'+data.items[i][2]+'</pre></td>'+
										'<td>sq.ft</td>'+
										'<td id="width">'+data.items[i][4].toFixed(2)+'</td>'+
										'<td id="height">'+data.items[i][5].toFixed(2)+'</td>'+
										'<td id="quantity">'+data.items[i][6].toFixed(2)+'</td>'+
										'<td id="sqft">'+square_fit.toFixed(2)+'</td>'+
										'<td id="rate" ><input type="text" style="width:80px;" class="form-control"></td>' +
										'<td id="total" style="font-weight:bold;" class="sum"><b>0.00</b></td>' +
										'<td style="display:none;">'+data.items[i][3]+'</td>'+
							'<td><a class="add-transaction-sale" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-transaction-sale" title="Edit" data-toggle="tooltip" id="edit_purchase"><i class="material-icons">&#xE254;</i></a><a class="delete-transaction-sale" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
								'</tr>';
								count++;
							$("table").append(row);
						$("table tbody tr").eq(index + 1).find(".edit-transaction-sale, .add-transaction-sale").toggle();
								$('[data-toggle="tooltip"]').tooltip();
								$('#item_code_sale').val("");
					}
					 });
				});

				// Add row on add button click
				$(document).on("click", ".add-transaction-sale", function(){
				sum = 0;

					var empty = false;
					var input = $(this).parents("tr").find('input[type="text"]');
							input.each(function(){
						if(!$(this).val()){
							$(this).addClass("error");
							empty = true;
						}
						else{
								$(this).removeClass("error");
								}

					});

				$(this).parents("tr").find(".error").first().focus();
				if(!empty){
					input.each(function(){
						$(this).parent("td").html($(this).val());
					});
					$(this).parents("tr").find(".add-transaction-sale, .edit-transaction-sale").toggle();
					$(".add-item-sale").removeAttr("disabled");
				}

				var get_sqft = $($(this).parents("tr").find("#sqft")).filter(function() {
						sqft = $(this).text();
						return sqft;
				}).closest("tr");

				var get_rate = $($(this).parents("tr").find("#rate")).filter(function() {
							rate = $(this).text();
							return rate;
					}).closest("tr");


				total = parseFloat(sqft) * parseFloat(rate)

				var get_total = $($(this).parents("tr").find("#total")).filter(function() {
							total = $(this).text(total.toFixed(2));
							return total;
					}).closest("tr");

				});

						// Edit row on edit button click
				$(document).on("click", ".edit-transaction-sale", function(){
				$(this).parents("tr").find("td:not(:last-child)").each(function(i){

						if (i === 9) {
							 $(this).html('<input type="text" style="width:80px;" class="form-control" value="' + $(this).text() + '">');
						}

				});
				$(this).parents("tr").find(".add-transaction-sale, .edit-transaction-sale").toggle();
				$(".add-item-sale").attr("disabled", "disabled");
				});

				// Delete row on delete button click
				$(document).on("click", ".delete-transaction-sale", function(){
				var row =  $(this).closest('tr');
				var siblings = row.siblings();
				siblings.each(function(index) {
				$(this).children('td').first().text(index + 1);
				});
				$(this).parents("tr").remove();
				$(".add-item-sale").removeAttr("disabled");
				});




				$('#new-sale-submit').on('submit',function(e){
				e.preventDefault();
				var table = $('#new-sale-table');
				var data = [];
				var sale_id = $('#sale_id').val();
				var follow_up = $('#follow_up').val();
				var customer = $('#customer').val();
				var payment_method = $('#payment_method').val();
				var footer_desc = $('#footer_desc').val();


				table.find('tr').each(function (i, el){
				if(i != 0)
				{
				var $tds = $(this).find('td');
				var row = {
					'item_code' : "",
					'width' : "",
					'height' : "",
					'quantity' : "",
					'rate' : "",
					'total': "",
					'measurment' : "",
				};
				$tds.each(function(i, el){
					if (i === 1) {
							row["item_code"] = ($(this).text());
							console.log($(this).text());
					}
					else if (i === 5) {
							row["width"] = ($(this).text());
					}
					else if (i === 6) {
							row["height"] = ($(this).text());
					}
					else if (i === 7) {
							row["quantity"] = ($(this).text());
					}
					else if (i === 9) {
							row["rate"] = ($(this).text());
					}
					else if (i === 10) {
							row["total"] = ($(this).text());
							console.log($(this).text());
					}
					else if (i === 11) {
							row["measurment"] = ($(this).text());
							console.log($(this).text());
					}
				});
				data.push(row);
				}
				});

				req =	$.ajax({
					headers: { "X-CSRFToken": getCookie("csrftoken") },
					type: 'POST',
					url : '/transaction/sale/new/',
					data:{
						'sale_id': sale_id,
						'customer': customer,
						'follow_up': follow_up,
						'payment_method': payment_method,
						'footer_desc': footer_desc,
						'items': JSON.stringify(data),
					},
					dataType: 'json'
				})
				.done(function done(){
					alert("Sales Created");
					location.reload();
				})
				});


// // ==================================================================================================================================
							// EDIT PURCHASE RETURN

								// Add row on add button click
								$(document).on("click", ".add-purchase-return", function(){
								var empty = false;
								var input = $(this).parents("tr").find('input[type="text"]');
										input.each(function(){
									if(!$(this).val()){
										$(this).addClass("error");
										empty = true;
									}
									else{
											$(this).removeClass("error");
											}
								});
								$(this).parents("tr").find(".error").first().focus();
								if(!empty){
									input.each(function(){
										$(this).parent("td").html($(this).val());
									});
									$(this).parents("tr").find(".add-purchase-return, .edit-purchase-return").toggle();
								}
								});


								// Edit row on edit button click
								$(document).on("click", ".edit-purchase-return", function(){
										$(this).parents("tr").find("td:not(:last-child)").each(function(i){
											if (i === 4) {
												$(this).html('<input type="text" class="form-control form-control-sm" value="' + $(this).text() + '">');
											}
								});
								$(this).parents("tr").find(".add-purchase-return, .edit-purchase-return").toggle();
								});


								// Delete row on delete button click
								$(document).on("click", ".delete-purchase-return", function(){
									var row =  $(this).closest('tr');
									var siblings = row.siblings();
									siblings.each(function(index) {
									$(this).children('td').first().text(index + 1);
									});
									$(this).parents("tr").remove();
									$(".add-item-sale").removeAttr("disabled");
								});

							//SUBMIT EDIT MRN SUPPLIER

							//updating data into supplier mrn using ajax request
							$('#new-purchase-return-submit').on('submit',function(e){
								e.preventDefault();
								var table = $('#new-purchase-return-table');
								var supplier = $('#supplier_purchase_return').val();
								var payment_method = $('#payment_purchase_return').val();
								var description = $('#desc_purchase_return').val();
								console.log(supplier);
								var data = [];
								table.find('tr').each(function (i, el){
									if(i != 0)
									{
										var $tds = $(this).find('td');
										var row = {
											'item_code' : "",
											'item_name' : "",
											'item_description' : "",
											'quantity' : "",
											'unit' : "",
											'price' : "",
											'sales_tax' : "",
										};
										$tds.each(function(i, el){
											if (i === 1) {
													row["item_code"] = ($(this).text());
											}
											if (i === 2) {
													row["item_name"] = ($(this).text());
											}
											else if (i === 3) {

													row["item_description"] = ($(this).text());
											}
											else if (i === 4) {
													row["quantity"] = ($(this).text());

											}
											else if (i === 5) {
													row["unit"] = ($(this).text());
											}
											else if (i === 6) {
													row["price"] = ($(this).text());
											}
											else if (i === 7) {
													row["sales_tax"] = ($(this).text());
											}
										});
										data.push(row);
									}
								});
									 req =	$.ajax({
											headers: { "X-CSRFToken": getCookie("csrftoken") },
											type: 'POST',
											url : `/transaction/purchase/return/${edit_id}`,
											data:{
												'supplier':supplier,
												'payment_method': payment_method,
												'description': description,
												'items': JSON.stringify(data),
											},
											dataType: 'json'
										})
										.done(function done(){
											alert("Updated");
											location.reload();
										})
							});

// //=======================================================================================
//
// // ==================================================================================================================================
// 							// EDIT PURCHASE RETURN

								// Add row on add button click
								$(document).on("click", ".add-sale-return", function(){
								var empty = false;
								var input = $(this).parents("tr").find('input[type="text"]');
										input.each(function(){
									if(!$(this).val()){
										$(this).addClass("error");
										empty = true;
									}
									else{
											$(this).removeClass("error");
											}
								});
								$(this).parents("tr").find(".error").first().focus();
								if(!empty){
									input.each(function(){
										$(this).parent("td").html($(this).val());
									});
									$(this).parents("tr").find(".add-sale-return, .edit-sale-return").toggle();
								}
								});


								// Edit row on edit button click
								$(document).on("click", ".edit-sale-return", function(){
										$(this).parents("tr").find("td:not(:last-child)").each(function(i){
											if (i === 4) {
												$(this).html('<input type="text" class="form-control form-control-sm" value="' + $(this).text() + '">');
											}
								});
								$(this).parents("tr").find(".add-sale-return, .edit-sale-return").toggle();
								});

							//SUBMIT EDIT MRN SUPPLIER

							//updating data into supplier mrn using ajax request
							$('#new-sale-return-submit').on('submit',function(e){
								e.preventDefault();
								var table = $('#new-sale-return-table');
								var customer = $('#customer_sale_return').val();
								var payment_method = $('#payment_sale_return').val();
								var description = $('#desc_sale_return').val();
								var data = [];
								table.find('tr').each(function (i, el){
									if(i != 0)
									{
										var $tds = $(this).find('td');
										var row = {
											'item_code' : "",
											'item_name' : "",
											'item_description' : "",
											'quantity' : "",
											'unit' : "",
											'price' : "",
											'sales_tax' : "",
										};
										$tds.each(function(i, el){
											if (i === 1) {
													row["item_code"] = ($(this).text());
											}
											if (i === 2) {
													row["item_name"] = ($(this).text());
											}
											else if (i === 3) {

													row["item_description"] = ($(this).text());
											}
											else if (i === 4) {
													row["quantity"] = ($(this).text());

											}
											else if (i === 5) {
													row["unit"] = ($(this).text());
											}
											else if (i === 6) {
													row["price"] = ($(this).text());
											}
											else if (i === 7) {
													row["sales_tax"] = ($(this).text());
											}
										});
										data.push(row);
									}
								});
									 req =	$.ajax({
											headers: { "X-CSRFToken": getCookie("csrftoken") },
											type: 'POST',
											url : `/transaction/sale/return/${edit_id}`,
											data:{
												'customer':customer,
												'payment_method': payment_method,
												'description': description,
												'items': JSON.stringify(data),
											},
											dataType: 'json'
										})
										.done(function done(){
											alert("Updated");
											location.reload();
										})
							});

//=======================================================================================


$(".add-item-sale-edit").click(function(){
	console.log("click");
	var item_code_sale = $('#item_code_sale_edit').val();
	req =	$.ajax({
		 headers: { "X-CSRFToken": getCookie("csrftoken") },
		 type: 'POST',
		 url : `/transaction/sale/edit/${edit_id}`,
		 data:{
			 'item_code_sale': item_code_sale,
		 },
		 dataType: 'json'
	 })
	 .done(function done(data){
		 var type = JSON.parse(data.row);
		 var index = $("table tbody tr:last-child").index();
		 total_amount = (type[0].fields['unit_price'] * type[0].fields['quantity']);
				 var row = '<tr>' +
						 '<td>'+count+'</td>' +
						 '<td>'+type[0].fields['product_code']+'</td>' +
						 '<td>'+type[0].fields['product_name']+'</td>' +
						 '<td id="desc" >'+ type[0].fields['product_desc'] +'</td>' +
						 '<td id="quantity_edit" ><input type="text" class="form-control" value=""></td>' +
						 '<td><input type="text" class="form-control" value=""></td>' +
						 '<td id="price_edit" ><input type="text" class="form-control" value=""></td>' +
						 '<td id="value_of_goods_edit" >0.00</td>' +
						 '<td id="sales_tax_edit"><input type="text" class="form-control" value=""></td>' +
						 '<td id="sales_tax_amount_edit">0.00</td>' +
			 '<td><a class="add-sale-edit" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-sale-edit" title="Edit" data-toggle="tooltip" id="edit_sale"><i class="material-icons">&#xE254;</i></a><a class="delete-sale-edit" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
				 '</tr>';
				 count++;
			 $("table").append(row);
		 $("table tbody tr").eq(index + 1).find(".add-sale-edit, .edit-sale-edit").toggle();
				 $('[data-toggle="tooltip"]').tooltip();
	 });
});


// Add row on add button click
$(document).on("click", ".add-sale-edit", function(){
sum = 0;
var empty = false;
var input = $(this).parents("tr").find('input[type="text"]');
		input.each(function(){
	if(!$(this).val()){
		$(this).addClass("error");
		empty = true;
	}
	else{
			$(this).removeClass("error");
			}
});
$(this).parents("tr").find(".error").first().focus();
if(!empty){
	input.each(function(){
		$(this).parent("td").html($(this).val());
	});
	$(this).parents("tr").find(".add-sale-edit, .edit-sale-edit").toggle();
	$(".add-item-sale").removeAttr("disabled");
}
console.log($(this));
var get_price = $($(this).parents("tr").find("#price_edit")).filter(function() {
				price = $(this).text();
				console.log(price);
				return price
		}).closest("tr");

var get_quantity = $($(this).parents("tr").find("#quantity_edit")).filter(function() {
				quantity = $(this).text();
				return quantity
		}).closest("tr");
		console.log(quantity);
var set_valueOfGoods = $($(this).parents("tr").find("#value_of_goods_edit")).filter(function() {
				value_of_goods =  quantity * price
				$(this).text(value_of_goods.toFixed(2))
				return value_of_goods;
		}).closest("tr");

var get_salesTax = $($(this).parents("tr").find("#sales_tax_edit")).filter(function() {
				sales_tax = value_of_goods * $(this).text();
				sales_tax = sales_tax / 100
				return sales_tax;
		}).closest("tr");

var set_salesTax = $($(this).parents("tr").find("#sales_tax_amount_edit")).filter(function() {
				$(this).text(sales_tax.toFixed(2));
				return sales_tax;
		}).closest("tr");

var set_total = $($(this).parents("tr").find("#total")).filter(function() {
				total = value_of_goods + sales_tax
				$(this).text(total.toFixed(2));
				return sales_tax;
		}).closest("tr");

		$($(this).parents("tr").find("#total")).each(function() {
				var value = $(this).text();
				// add only if the value is number
				if(!isNaN(value) && value.length != 0) {
						console.log(value);
				}
	});

	$('#new-sale-table > tbody  > tr').each(function() {
		 sum = sum + parseFloat($(this).find('td#total').text());
	});

});

			// Edit row on edit button click
$(document).on("click", ".edit-sale-edit", function(){
	$(this).parents("tr").find("td:not(:last-child)").each(function(i){
			if (i === 3) {
				$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
			}
			if (i === 4) {
				$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
			}
			if (i === 5) {
				 $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
			}
			if (i === 8) {
				 $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
			}

});
$(this).parents("tr").find(".add-sale-edit, .edit-sale-edit").toggle();
$(".add-item-sale").attr("disabled", "disabled");
});

// Delete row on delete button click
$(document).on("click", ".delete-sale-edit", function(){
	var row =  $(this).closest('tr');
	var siblings = row.siblings();
	siblings.each(function(index) {
	$(this).children('td').first().text(index + 1);
	});
	$(this).parents("tr").remove();
	$(".add-item-sale").removeAttr("disabled");
});

$('#cartage_amount').on('keyup',function(e){
var i = this.value;
var at = $('#additional_tax').val()
if(!isNaN(i) && i.length != 0){
	if (!isNaN(at)) {
			var a =  sum
			var v =  parseFloat(a) + parseFloat(i) + parseFloat(at)
			$('#last_grand_total').val(v.toFixed(2));
	}
	else {
			var a =  sum
			var v =  parseFloat(a) + parseFloat(i)
			$('#last_grand_total').val(v.toFixed(2));
	}
}
else {
if (!isNaN(at)) {
	sum = parseFloat(at) + sum;
	$('#last_grand_total').val(sum.toFixed(2));
}
else {
	$('#last_grand_total').val(sum);
}
}
});

$('#additional_tax').on('keyup',function(){
var i = this.value;
var ac = $('#cartage_amount').val()
if(!isNaN(i) && i.length != 0){
	if (!isNaN(ac)) {
			var a =  sum
			var v =  parseFloat(a) + parseFloat(i) + parseFloat(ac)
			$('#last_grand_total').val(v.toFixed(2));
	}
	else {
			var a =  sum
			var v =  parseFloat(a) + parseFloat(i)
			$('#last_grand_total').val(v.toFixed(2));
	}
}
else {
if (!isNaN(ac)) {
	sum = parseFloat(ac) + sum;
	$('#last_grand_total').val(sum.toFixed(2));
}
else {
	$('#last_grand_total').val(sum);
}
}

})


$('#withholding_tax').on('keyup',function(){
var i = this.value;
var cartage_amount = parseFloat($('#cartage_amount').val());
var additional_tax = parseFloat($('#additional_tax').val());
var grand_total = parseFloat(sum);
var a =  cartage_amount + additional_tax + grand_total;
console.log(a);
var withholding_tax =  a.toFixed(2) * i;
withholding_tax = withholding_tax / 100;
var amount =  withholding_tax + cartage_amount + additional_tax +  grand_total
$('#last_grand_total').val(amount.toFixed(2));
})


	//EDIT PURCHASE END

$('#edit-sale-submit').on('submit',function(e){
	e.preventDefault();
	var table = $('#edit-sale-table');
	var data = [];
	var sale_id = $('#sale_id').val();
	var customer = $('#customer_name_sale').val();
	var payment_method = $('#payment_method').val();
	var footer_desc = $('#footer_desc').val();
	console.log(footer_desc);

	var cartage_amount = $('#cartage_amount').val();
	var additional_tax = $('#additional_tax').val();
	var withholding_tax = $('#withholding_tax').val();


	table.find('tr').each(function (i, el){
		if(i != 0)
		{
			var $tds = $(this).find('td');
			var row = {
				'item_code' : "",
				'item_name' : "",
				'item_description' : "",
				'quantity' : "",
				'unit' : "",
				'price' : "",
				'sales_tax' : "",
			};
			$tds.each(function(i, el){
				if (i === 1) {
						row["item_code"] = ($(this).text());
				}
				if (i === 2) {
						row["item_name"] = ($(this).text());
				}
				else if (i === 3) {
						row["item_description"] = ($(this).text());
				}
				else if (i === 4) {
						row["quantity"] = ($(this).text());
				}
				else if (i === 5) {
						row["unit"] = ($(this).text());
				}
				else if (i === 6) {
						row["price"] = ($(this).text());
				}
				else if (i === 8) {
						row["sales_tax"] = ($(this).text());
				}
			});
			data.push(row);
		}
	});

		 req =	$.ajax({
				headers: { "X-CSRFToken": getCookie("csrftoken") },
				type: 'POST',
				url : `/transaction/sale/edit/${edit_id}`,
				data:{
					'sale_id': sale_id,
					'customer': customer,
					'payment_method': payment_method,
					'footer_desc': footer_desc,
					'cartage_amount': cartage_amount,
					'additional_tax':additional_tax,
					'withholding_tax':withholding_tax,
					'items': JSON.stringify(data),
				},
				dataType: 'json'
			})
			.done(function done(){
				alert("Sale Updated");
				location.reload();
			})
});

// =============================================================================


$('#edit-sale-return-submit').on('submit',function(e){
	e.preventDefault();
	var table = $('#new-sale-return-table');
	var data = [];
	var sale_id = $('#sale_return_id').val();
	var customer = $('#customer_sale_return_name').val();
	console.log(sale_id);
	var payment_method = $('#payment_method').val();
	var footer_desc = $('#desc_sale_return').val();


	table.find('tr').each(function (i, el){
		if(i != 0)
		{
			var $tds = $(this).find('td');
			var row = {
				'item_code' : "",
				'item_name' : "",
				'item_description' : "",
				'quantity' : "",
				'unit' : "",
				'price' : "",
				'sales_tax' : "",
			};
			$tds.each(function(i, el){
				if (i === 1) {
						row["item_code"] = ($(this).text());
				}
				if (i === 2) {
						row["item_name"] = ($(this).text());
				}
				else if (i === 3) {
						row["item_description"] = ($(this).text());
				}
				else if (i === 4) {
						row["quantity"] = ($(this).text());
				}
				else if (i === 5) {
						row["unit"] = ($(this).text());
				}
				else if (i === 6) {
						row["price"] = ($(this).text());
				}
				else if (i === 7) {
						row["sales_tax"] = ($(this).text());
				}
			});
			data.push(row);
		}
	});

		 req =	$.ajax({
				headers: { "X-CSRFToken": getCookie("csrftoken") },
				type: 'POST',
				url : `/transaction/sale/return/edit/${edit_id}`,
				data:{
					'sale_id': sale_id,
					'customer': customer,
					'payment_method': payment_method,
					'footer_desc': footer_desc,
					'items': JSON.stringify(data),
				},
				dataType: 'json'
			})
			.done(function done(){
				alert("Sale Return Updated");
				location.reload();
			})
});

// ================================================================================

$.fn.extend({
	treed: function (o) {

		var openedClass = 'fa fa-minus';
		var closedClass = 'fa fa-plus';

		if (typeof o != 'undefined'){
			if (typeof o.openedClass != 'undefined'){
			openedClass = o.openedClass;
			}
			if (typeof o.closedClass != 'undefined'){
			closedClass = o.closedClass;
			}
		};

			//initialize each of the top levels
			var tree = $(this);
			tree.addClass("tree");
			tree.find('li').has("ul").each(function () {
					var branch = $(this); //li with children ul
					branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
					branch.addClass('branch');
					branch.on('click', function (e) {
							if (this == e.target) {
									var icon = $(this).children('i:first');
									icon.toggleClass(openedClass + " " + closedClass);
									$(this).children().children().toggle();
							}
					})
					branch.children().children().toggle();
			});
			//fire event from the dynamically added icon
		tree.find('.branch .indicator').each(function(){
			$(this).on('click', function () {
					$(this).closest('li').click();
			});
		});
			//fire event to open branch if the li contains an anchor instead of text
			tree.find('.branch>a').each(function () {
					$(this).on('click', function (e) {
							$(this).closest('li').click();
							e.preventDefault();
					});
			});
			//fire event to open branch if the li contains a button instead of text
			tree.find('.branch>button').each(function () {
					$(this).on('click', function (e) {
							$(this).closest('li').click();
							e.preventDefault();
					});
			});
	}
});


		$(".add-item-jv").click(function(){
			var account_title = $('#account_title').val();
			req =	$.ajax({
				 headers: { "X-CSRFToken": getCookie("csrftoken") },
				 type: 'POST',
				 data:{
					 'account_title': account_title,
				 },
				 dataType: 'json'
			 })
			 .done(function done(data){
					 var index = $("table tbody tr:last-child").index();
							 var row = '<tr>' +
									 '<td>'+ data.account_id +'</td>' +
									 '<td>'+ data.account_title +'</td>' +
									 '<td><input type="text" class="form-control" required value="0.00"></td>' +
									 '<td><input type="text" class="form-control" required value="0.00"></td>' +
						 '<td><a class="add-jv" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-jv" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a><a class="delete-jv" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
							 '</tr>';
						 $("table").append(row);
					 $("table tbody tr").eq(index + 1).find(".add-jv, .edit-jv").toggle();
							 $('[data-toggle="tooltip"]').tooltip();

			 })
		});


		// Add row on add button click
		$(document).on("click", ".add-jv", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
				input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			}
			else{
					$(this).removeClass("error");
					}
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});
			$(this).parents("tr").find(".add-jv, .edit-jv").toggle();
			$(".add-item-jv").removeAttr("disabled");
		}
		});


		// Edit row on edit button click
		$(document).on("click", ".edit-jv", function(){
				$(this).parents("tr").find("td:not(:last-child)").each(function(i){
					if (i === 2 ) {
						$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
					}
					if (i === 3) {
						$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
					}

		});
		$(this).parents("tr").find(".add-jv, .edit-jv").toggle();
		$(".add-item-jv").attr("disabled", "disabled");
		});

		// Delete row on delete button click
		$(document).on("click", ".delete-jv", function(){
			var row =  $(this).closest('tr');
			var siblings = row.siblings();
			siblings.each(function(index) {
			$(this).children('td').first().text(index + 1);
			});
			$(this).parents("tr").remove();
			$(".add-item-jv").removeAttr("disabled");
		});



			$('#new-jv-form').on('submit',function(e){
				e.preventDefault();
				var table = $('#new-jv-table');
				var data = [];
				var debit = 0;
				var credit = 0;
				var doc_no = $('#doc_no').val();
				var doc_date = $('#doc_date').val();
				var description = $('#description').val();

				table.find('tr').each(function (i, el){
					if(i != 0)
					{
						var $tds = $(this).find('td');
						var row = {
							'account_id' : "",
							'account_title' : "",
							'debit' : "",
							'credit' : "",
						};
						$tds.each(function(i, el){
							if (i === 0) {
									row["account_id"] = ($(this).text());
							}
							if (i === 1) {
									row["account_title"] = ($(this).text());
							}
							else if (i === 2) {
									row["debit"] = ($(this).text());
									debit = debit + parseFloat(($(this).text()));
							}
							else if (i === 3) {
									row["credit"] = ($(this).text());
									credit = credit + parseFloat(($(this).text()));
							}
						});
						data.push(row);
					}
				});
				if (debit == credit) {
					req =	$.ajax({
						 headers: { "X-CSRFToken": getCookie("csrftoken") },
						 type: 'POST',
						 url : '/transaction/journal_voucher/new',
						 data:{
							 'doc_no': doc_no,
							 'doc_date': doc_date,
							 'description': description,
							 'items': JSON.stringify(data),
						 },
						 dataType: 'json'
					 })
					 .done(function done(data){
						 if (data.result != "success") {
							 alert(data.result)
						 }
						 else {
							 alert("Journal Voucher Submitted");
							 location.reload();
						 }
					 })
				}
				else {
					alert("Debit and Credit sides are not same");
				}

			});


//Initialization of treeviews

$('#tree1').treed();



// ===============================================================================
// JOB ORDER

			$(".add-item-jo").click(function(){
				var item_code = $('#item_code_jo').val();
				console.log(item_code);
				req =	$.ajax({
					 headers: { "X-CSRFToken": getCookie("csrftoken") },
					 type: 'POST',
					 url : '/transaction/job_order/new/',
					 data:{
						 'item_code': item_code,
					 },
					 dataType: 'json'
				 })
				 .done(function done(data){
					 var type = JSON.parse(data.row);
					 console.log(type);
						 // Append table with add row form on add new button click
						$(this).attr("disabled", "disabled");
						var index = $("table tbody tr:last-child").index();
								var row = '<tr>' +
										'<td>'+count+'</td>' +
										'<td>'+type[0].fields['item_code']+'</td>' +
										'<td>'+type[0].fields['item_name']+'</td>' +
										'<td><pre>'+type[0].fields['item_description']+'</pre></td>' +
										'<td id="" width="150px"><select id="sel" class="form-control" style=" height:35px;"><option>sq.ft</option><option>sq.inches</option></select></td>' +
										'<td id="width"><input type="text" style="width:60px;" class="form-control" value=""></td>' +
										'<td id="height"><input type="text" style="width:60px;" class="form-control" value=""></td>' +
										'<td id="quantity"><input type="text" style="width:60px;" class="form-control" value=""></td>' +
										'<td id="square_fit">0.00</td>' +
										'<td id="measurment" style="display:none;">1</td>' +
										'<td><a class="add-jo" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-jo" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a><a class="delete-jo" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
								'</tr>';
								count++;
							$("table").append(row);
						$("table tbody tr").eq(index + 1).find(".add-jo, .edit-jo").toggle();
								$('[data-toggle="tooltip"]').tooltip();
				 });
				 $('#item_code_jo').val("");
				 $(".add-item-jo").attr("disabled", "disabled");
				 $(".has_id").attr("disabled", "disabled");
			});

		// Add row on add button click
		$(document).on("click", ".add-jo", function(){
			var empty = false;
			var input = $(this).parents("tr").find('input[type="text"]');
					input.each(function(){
				if(!$(this).val()){
					$(this).addClass("error");
					empty = true;
				}
				else{
						$(this).removeClass("error");
						}
			});


			$(this).parents("tr").find(".error").first().focus();
			if(!empty){
				input.each(function(){
					$(this).parent("td").html($(this).val());
				});
				$(this).parents("tr").find(".add-jo, .edit-jo").toggle();
				$(".add-item-jo").removeAttr("disabled");
				$(".has_id").removeAttr("disabled");
			}

			var meas;
					$('#new-jo-table tbody tr').each(function() {
					    var tdObject = $(this).find('td:eq(4)'); //locate the <td> holding select;
					    var selectObject = tdObject.find("select"); //grab the <select> tag assuming that there will be only single select box within that <td>
					    meas = selectObject.val(); // get the selected country from current <tr>
				});

			var get_height = $($(this).parents("tr").find("#height")).filter(function() {
							height = $(this).text();
							return height
					}).closest("tr");

			var get_width = $($(this).parents("tr").find("#width")).filter(function() {
							width = $(this).text();
							return width
					}).closest("tr");


			var get_quantity = $($(this).parents("tr").find("#quantity")).filter(function() {
							quantity = $(this).text();
							return quantity
					}).closest("tr");

					console.log(meas);
			if (meas === "sq.ft") {
				square_fit = parseFloat(width) * parseFloat(height);
				square_fit = square_fit * parseFloat(quantity)
				var set_square_fit = $($(this).parents("tr").find("#square_fit")).filter(function() {
								$(this).text(square_fit.toFixed(2));
								return square_fit
						}).closest("tr");
				var measurment = $($(this).parents("tr").find("#measurment")).filter(function() {
								$(this).text("sq.ft");
								return measurment
						}).closest("tr");
			}
			else if (meas === "sq.inches") {
				square_fit = parseFloat(width) * parseFloat(height)
				square_fit = square_fit / 144
				square_fit = square_fit * parseFloat(quantity)
				var set_square_fit = $($(this).parents("tr").find("#square_fit")).filter(function() {
								$(this).text(square_fit.toFixed(2));
								return square_fit
						}).closest("tr");
				var measurment = $($(this).parents("tr").find("#measurment")).filter(function() {
								$(this).text("sq.inches");
								return measurment
						}).closest("tr");
				$('#meas').prop('disabled', 'disabled');
			}





		});

		// Edit row on edit button click
		$(document).on("click", ".edit-jo", function(){
				$(this).parents("tr").find("td:not(:last-child)").each(function(i){
					if (i === 5) {
						$(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
					}
					if (i === 6) {
						$(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
					}
					if (i === 7) {
						$(this).html('<input type="text" style="width:60px;" class="form-control" value="' + $(this).text() + '">');
					}
		});
		$(this).parents("tr").find(".add-jo, .edit-jo").toggle();
		$(".add-item-jo").attr("disabled", "disabled");
		$(".has_id").attr("disabled", "disabled");
		});

		// Delete row on delete button click
		$(document).on("click", ".delete-jo", function(){
			var row =  $(this).closest('tr');
			var siblings = row.siblings();
			siblings.each(function(index) {
			$(this).children('td').first().text(index + 1);
			});
			$(this).parents("tr").remove();
			$(".add-item-jo").removeAttr("disabled");
		});

		//NEW RFQ SUPPLIER END

		$('#new-jo-submit').on('submit',function(e){
			e.preventDefault();
			var table = $('#new-jo-table');
			var data = [];
			var client_name = $('#client_name').val();
			var file_name = $('#file_name').val();
			var delivery_date = $('#delivery_date').val();
			var remarks = $('#remarks').val();
			var meas = $('#meas').find(":selected").text();

			table.find('tr').each(function (i, el){
				if(i != 0)
				{
					var $tds = $(this).find('td');
					var row = {
						'item_code' : "",
						'item_name' : "",
						'item_description' : "",
						'width' : "",
						'height' : "",
						'quantity' : "",
						'measurment': "",
					};
					$tds.each(function(i, el){
						if (i === 1) {
								row["item_code"] = ($(this).text());
						}
						if (i === 2) {
								row["item_name"] = ($(this).text());
						}
						else if (i === 3) {
								row["item_description"] = ($(this).text());
						}
						else if (i === 5) {
								row["width"] = ($(this).text());
						}
						else if (i === 6) {
								row["height"] = ($(this).text());
						}
						else if (i === 7) {
								row["quantity"] = ($(this).text());
						}
						else if (i === 9) {
								row["measurment"] = ($(this).text());
						}
					});
					data.push(row);
					console.log(row);
				}
			});

				 req =	$.ajax({
						headers: { "X-CSRFToken": getCookie("csrftoken") },
						type: 'POST',
						url : '/transaction/job_order/new/',
						data:{
							'client_name': client_name,
							'file_name': file_name,
							'delivery_date': delivery_date,
							'remarks': remarks,
							'items': JSON.stringify(data),
						},
						dataType: 'json'
					})
					.done(function done(data){
						if (data.result != "success") {
							alert(data.result)
						}
						else{
							alert("Job Order Submitted");
							location.reload();
						}
					})
		});

		$(".add-item-bpv").click(function(){
			var account_title = $('#account_title').val();
			req =	$.ajax({
				 headers: { "X-CSRFToken": getCookie("csrftoken") },
				 type: 'POST',
				 data:{
					 'account_title': account_title,
				 },
				 dataType: 'json'
			 })
			 .done(function done(data){
					 var index = $("table tbody tr:last-child").index();
							 var row = '<tr>' +
									 '<td>'+ data.account_id +'</td>' +
									 '<td>'+ data.account_title +'</td>' +
									 '<td><input type="text" class="form-control" required value="0.00"></td>' +
									 '<td><input type="text" class="form-control" required value="0.00"></td>' +
						 '<td width="100px"><a class="add-bpv" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-bpv" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a> <a class="delete-bpv" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
							 '</tr>';
						 $("table").append(row);
					 $("table tbody tr").eq(index + 1).find(".add-bpv, .edit-bpv").toggle();
							 $('[data-toggle="tooltip"]').tooltip();

			 })
		});


		// Add row on add button click
		$(document).on("click", ".add-bpv", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
				input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			}
			else{
					$(this).removeClass("error");
					}
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});
			$(this).parents("tr").find(".add-bpv, .edit-bpv").toggle();
			$(".add-item-jv").removeAttr("disabled");
		}
		});


		$(document).on("click", ".edit-bpv", function(){
				$(this).parents("tr").find("td:not(:last-child)").each(function(i){
					if (i === 2 ) {
						$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
					}
					if (i === 3) {
						$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
					}

		});
		$(this).parents("tr").find(".add-bpv, .edit-bpv").toggle();
		$(".add-item-jv").attr("disabled", "disabled");
		});

		// Delete row on delete button click
		$(document).on("click", ".delete-bpv", function(){
			var row =  $(this).closest('tr');
			var siblings = row.siblings();
			siblings.each(function(index) {
			$(this).children('td').first().text(index + 1);
			});
			$(this).parents("tr").remove();
			$(".add-item-jv").removeAttr("disabled");
		});



			$('#new-jv-form-bpv').on('submit',function(e){
				e.preventDefault();
				var table = $('#new-bpv-table');
				var data = [];
				var debit = 0;
				var credit = 0;
				var doc_no = $('#doc_no').val();
				var doc_date = $('#doc_date').val()
				var cheque_no = $('#cheque_no').val();;
				var cheque_date = $('#cheque_date').val();
				var description = $('#description').val();

				table.find('tr').each(function (i, el){
					if(i != 0)
					{
						var $tds = $(this).find('td');
						var row = {
							'account_id' : "",
							'account_title' : "",
							'debit' : "",
							'credit' : "",
						};
						$tds.each(function(i, el){
							if (i === 0) {
									row["account_id"] = ($(this).text());
							}
							if (i === 1) {
									row["account_title"] = ($(this).text());
							}
							else if (i === 2) {
									row["debit"] = ($(this).text());
									debit = debit + parseFloat(($(this).text()));
							}
							else if (i === 3) {
									row["credit"] = ($(this).text());
									credit = credit + parseFloat(($(this).text()));
							}
						});
						data.push(row);
					}
				});
				if (debit == credit) {
					req =	$.ajax({
						 headers: { "X-CSRFToken": getCookie("csrftoken") },
						 type: 'POST',
						 url : '/transaction/bank_payment_voucher/new',
						 data:{
							 'doc_no': doc_no,
							 'doc_date': doc_date,
							 'cheque_no': cheque_no,
							 'cheque_date': cheque_date,
							 'description': description,
							 'items': JSON.stringify(data),
						 },
						 dataType: 'json'
					 })
					 .done(function done(data){
						 if (data.result != "success") {
							 alert(data.result)
						 }
						 else {
							 alert("Voucher Submitted");
							 location.reload();
						 }
					 })
				}
				else {
					alert("Debit and Credit sides are not same");
				}

			});


			$(".add-item-cpv").click(function(){
		        console.log("hamza")
				var account_title = $('#account_title').val();
				req =	$.ajax({
					 headers: { "X-CSRFToken": getCookie("csrftoken") },
					 type: 'POST',
					 data:{
						 'account_title': account_title,
					 },
					 dataType: 'json'
				 })
				 .done(function done(data){
						 var index = $("table tbody tr:last-child").index();
								 var row = '<tr>' +
										 '<td>'+ data.account_id +'</td>' +
										 '<td>'+ data.account_title +'</td>' +
										 '<td><input type="text" class="form-control" required value="0.00"></td>' +
										 '<td><input type="text" class="form-control" required value="0.00"></td>' +
							 '<td width="100px"><a class="add-cpv" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-cpv" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a> <a class="delete-cpv" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
								 '</tr>';
							 $("table").append(row);
						 $("table tbody tr").eq(index + 1).find(".add-cpv, .edit-cpv").toggle();
								 $('[data-toggle="tooltip"]').tooltip();

				 })
			});


			// Add row on add button click
			$(document).on("click", ".add-cpv", function(){
			var empty = false;
			var input = $(this).parents("tr").find('input[type="text"]');
					input.each(function(){
				if(!$(this).val()){
					$(this).addClass("error");
					empty = true;
				}
				else{
						$(this).removeClass("error");
						}
			});
			$(this).parents("tr").find(".error").first().focus();
			if(!empty){
				input.each(function(){
					$(this).parent("td").html($(this).val());
				});
				$(this).parents("tr").find(".add-cpv, .edit-cpv").toggle();
				$(".add-item-cpv").removeAttr("disabled");
			}
			});


			$(document).on("click", ".edit-cpv", function(){
					$(this).parents("tr").find("td:not(:last-child)").each(function(i){
						if (i === 2 ) {
							$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
						}
						if (i === 3) {
							$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
						}

			});
			$(this).parents("tr").find(".add-cpv, .edit-cpv").toggle();
			$(".add-item-cpv").attr("disabled", "disabled");
			});

			// Delete row on delete button click
			$(document).on("click", ".delete-cpv", function(){
				var row =  $(this).closest('tr');
				var siblings = row.siblings();
				siblings.each(function(index) {
				$(this).children('td').first().text(index + 1);
				});
				$(this).parents("tr").remove();
				$(".add-item-cpv").removeAttr("disabled");
			});



				$('#new-jv-form-cpv').on('submit',function(e){
					e.preventDefault();
					var table = $('#new-cpv-table');
					var data = [];
					var debit = 0;
					var credit = 0;
					var doc_no = $('#doc_no').val();
					var doc_date = $('#doc_date').val()
					var cheque_no = $('#cheque_no').val();;
					var cheque_date = $('#cheque_date').val();
					var description = $('#description').val();

					table.find('tr').each(function (i, el){
						if(i != 0)
						{
							var $tds = $(this).find('td');
							var row = {
								'account_id' : "",
								'account_title' : "",
								'debit' : "",
								'credit' : "",
							};
							$tds.each(function(i, el){
								if (i === 0) {
										row["account_id"] = ($(this).text());
								}
								if (i === 1) {
										row["account_title"] = ($(this).text());
								}
								else if (i === 2) {
										row["debit"] = ($(this).text());
										debit = debit + parseFloat(($(this).text()));
								}
								else if (i === 3) {
										row["credit"] = ($(this).text());
										credit = credit + parseFloat(($(this).text()));
								}
							});
							data.push(row);
						}
					});
					if (debit == credit) {
						req =	$.ajax({
							 headers: { "X-CSRFToken": getCookie("csrftoken") },
							 type: 'POST',
							 data:{
								 'doc_no': doc_no,
								 'doc_date': doc_date,
								 'cheque_no': cheque_no,
								 'cheque_date': cheque_date,
								 'description': description,
								 'items': JSON.stringify(data),
							 },
							 dataType: 'json'
						 })
						 .done(function done(data){
							 if (data.result != "success") {
								 alert(data.result)
							 }
							 else {
								 alert("Voucher Submitted");
								 location.reload();
							 }
						 })
					}
					else {
						alert("Debit and Credit sides are not same");
					}

				});

				$(".add-item-crv").click(function(){
					var account_title = $('#account_title').val();
					req =	$.ajax({
						 headers: { "X-CSRFToken": getCookie("csrftoken") },
						 type: 'POST',
						 data:{
							 'account_title': account_title,
						 },
						 dataType: 'json'
					 })
					 .done(function done(data){
							 var index = $("table tbody tr:last-child").index();
									 var row = '<tr>' +
											 '<td>'+ data.account_id +'</td>' +
											 '<td>'+ data.account_title +'</td>' +
											 '<td><input type="text" class="form-control" required value="0.00"></td>' +
											 '<td><input type="text" class="form-control" required value="0.00"></td>' +
								 '<td width="100px"><a class="add-crv" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-crv" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a> <a class="delete-crv" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
									 '</tr>';
								 $("table").append(row);
							 $("table tbody tr").eq(index + 1).find(".add-crv, .edit-crv").toggle();
									 $('[data-toggle="tooltip"]').tooltip();

					 })
				});


				// Add row on add button click
				$(document).on("click", ".add-crv", function(){
				var empty = false;
				var input = $(this).parents("tr").find('input[type="text"]');
						input.each(function(){
					if(!$(this).val()){
						$(this).addClass("error");
						empty = true;
					}
					else{
							$(this).removeClass("error");
							}
				});
				$(this).parents("tr").find(".error").first().focus();
				if(!empty){
					input.each(function(){
						$(this).parent("td").html($(this).val());
					});
					$(this).parents("tr").find(".add-crv, .edit-crv").toggle();
					$(".add-item-crv").removeAttr("disabled");
				}
				});


				$(document).on("click", ".edit-crv", function(){
						$(this).parents("tr").find("td:not(:last-child)").each(function(i){
							if (i === 2 ) {
								$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
							}
							if (i === 3) {
								$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
							}

				});
				$(this).parents("tr").find(".add-crv, .edit-crv").toggle();
				$(".add-item-cpv").attr("disabled", "disabled");
				});

				// Delete row on delete button click
				$(document).on("click", ".delete-crv", function(){
					var row =  $(this).closest('tr');
					var siblings = row.siblings();
					siblings.each(function(index) {
					$(this).children('td').first().text(index + 1);
					});
					$(this).parents("tr").remove();
					$(".add-item-cpv").removeAttr("disabled");
				});



					$('#new-jv-form-crv').on('submit',function(e){
						e.preventDefault();
						var table = $('#new-crv-table');
						var data = [];
						var debit = 0;
						var credit = 0;
						var doc_no = $('#doc_no').val();
						var doc_date = $('#doc_date').val()
						var description = $('#description').val();

						table.find('tr').each(function (i, el){
							if(i != 0)
							{
								var $tds = $(this).find('td');
								var row = {
									'account_id' : "",
									'account_title' : "",
									'debit' : "",
									'credit' : "",
								};
								$tds.each(function(i, el){
									if (i === 0) {
											row["account_id"] = ($(this).text());
									}
									if (i === 1) {
											row["account_title"] = ($(this).text());
									}
									else if (i === 2) {
											row["debit"] = ($(this).text());
											debit = debit + parseFloat(($(this).text()));
									}
									else if (i === 3) {
											row["credit"] = ($(this).text());
											credit = credit + parseFloat(($(this).text()));
									}
								});
								data.push(row);
							}
						});
						if (debit == credit) {
							req =	$.ajax({
								 headers: { "X-CSRFToken": getCookie("csrftoken") },
								 type: 'POST',
								 data:{
									 'doc_no': doc_no,
									 'doc_date': doc_date,
									 'description': description,
									 'items': JSON.stringify(data),
								 },
								 dataType: 'json'
							 })
							 .done(function done(data){
								 if (data.result != "success") {
									 alert(data.result)
								 }
								 else {
									 alert("Voucher Submitted");
									 location.reload();
								 }
							 })
						}
						else {
							alert("Debit and Credit sides are not same");
						}

					});

					$(".add-item-brv").click(function(){
						var account_title = $('#account_title').val();
						req =	$.ajax({
							 headers: { "X-CSRFToken": getCookie("csrftoken") },
							 type: 'POST',
							 data:{
								 'account_title': account_title,
							 },
							 dataType: 'json'
						 })
						 .done(function done(data){
								 var index = $("table tbody tr:last-child").index();
										 var row = '<tr>' +
												 '<td>'+ data.account_id +'</td>' +
												 '<td>'+ data.account_title +'</td>' +
												 '<td><input type="text" class="form-control" required value="0.00"></td>' +
												 '<td><input type="text" class="form-control" required value="0.00"></td>' +
									 '<td width="100px"><a class="add-brv" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a><a class="edit-brv" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a> <a class="delete-brv" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a></td>' +
										 '</tr>';
									 $("table").append(row);
								 $("table tbody tr").eq(index + 1).find(".add-brv, .edit-brv").toggle();
										 $('[data-toggle="tooltip"]').tooltip();

						 })
					});


					// Add row on add button click
					$(document).on("click", ".add-brv", function(){
					var empty = false;
					var input = $(this).parents("tr").find('input[type="text"]');
							input.each(function(){
						if(!$(this).val()){
							$(this).addClass("error");
							empty = true;
						}
						else{
								$(this).removeClass("error");
								}
					});
					$(this).parents("tr").find(".error").first().focus();
					if(!empty){
						input.each(function(){
							$(this).parent("td").html($(this).val());
						});
						$(this).parents("tr").find(".add-brv, .edit-brv").toggle();
						$(".add-item-crv").removeAttr("disabled");
					}
					});


					$(document).on("click", ".edit-brv", function(){
							$(this).parents("tr").find("td:not(:last-child)").each(function(i){
								if (i === 2 ) {
									$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
								}
								if (i === 3) {
									$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
								}

					});
					$(this).parents("tr").find(".add-brv, .edit-brv").toggle();
					$(".add-item-cpv").attr("disabled", "disabled");
					});

					// Delete row on delete button click
					$(document).on("click", ".delete-brv", function(){
						var row =  $(this).closest('tr');
						var siblings = row.siblings();
						siblings.each(function(index) {
						$(this).children('td').first().text(index + 1);
						});
						$(this).parents("tr").remove();
						$(".add-item-cpv").removeAttr("disabled");
					});



						$('#new-jv-form-brv').on('submit',function(e){
							e.preventDefault();
							var table = $('#new-brv-table');
							var data = [];
							var debit = 0;
							var credit = 0;
							var doc_no = $('#doc_no').val();
							var cheque_no = $('#cheque_no').val();
							var cheque_date = $('#cheque_date').val();
							var doc_date = $('#doc_date').val()
							var description = $('#description').val();

							table.find('tr').each(function (i, el){
								if(i != 0)
								{
									var $tds = $(this).find('td');
									var row = {
										'account_id' : "",
										'account_title' : "",
										'debit' : "",
										'credit' : "",
									};
									$tds.each(function(i, el){
										if (i === 0) {
												row["account_id"] = ($(this).text());
										}
										if (i === 1) {
												row["account_title"] = ($(this).text());
										}
										else if (i === 2) {
												row["debit"] = ($(this).text());
												debit = debit + parseFloat(($(this).text()));
										}
										else if (i === 3) {
												row["credit"] = ($(this).text());
												credit = credit + parseFloat(($(this).text()));
										}
									});
									data.push(row);
								}
							});
							if (debit == credit) {
								req =	$.ajax({
									 headers: { "X-CSRFToken": getCookie("csrftoken") },
									 type: 'POST',
									 data:{
										 'doc_no': doc_no,
										 'cheque_no': cheque_no,
										 'cheque_date': cheque_date,
										 'doc_date': doc_date,
										 'description': description,
										 'items': JSON.stringify(data),
									 },
									 dataType: 'json'
								 })
								 .done(function done(data){
									 if (data.result != "success") {
										 alert(data.result)
									 }
									 else {
										 alert("Voucher Submitted");
										 location.reload();
									 }
								 })
							}
							else {
								alert("Debit and Credit sides are not same");
							}

						});


});
