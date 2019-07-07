from django.shortcuts import render, redirect
from inventory.models import Add_item
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.core import serializers
from .models import (ChartOfAccount, PurchaseHeader, PurchaseReturnHeader, PurchaseDetail, SaleHeader, SaleDetail,
                    Company_info, SaleReturnDetail, SaleReturnHeader, VoucherHeader, VoucherDetail, Transactions,
                    JobOrderHeader, JobOrderDetail)
import datetime, json
from .utils import render_to_pdf
from django.template.loader import get_template
from django.db import connection


@login_required()
def home(request):
    return render(request, 'transaction/index.html')


@login_required()
def purchase(request):
    all_purchases = PurchaseHeader.objects.all()
    return render(request, 'transaction/purchase.html',{'all_purchases': all_purchases})


@login_required()
def new_purchase(request):
    total_amount = 0
    serial = "1"
    last_purchase_no = PurchaseHeader.objects.last()
    all_item_code = Add_item.objects.all()
    all_accounts = ChartOfAccount.objects.all()
    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if last_purchase_no:
        last_purchase_no = last_purchase_no.purchase_no[6:]
        serial = str((int(last_purchase_no) + 1))
        last_purchase_no = date[2:]+'PI'+serial
    else:
        last_purchase_no =  date[2:]+'PI1'
    item_code = request.POST.get('item_code_purchase')
    if item_code:
        items = Add_item.objects.filter(item_code = item_code)
        print(items)
        items = serializers.serialize('json',items)
        return JsonResponse({"items":items})
    if request.method == "POST":
        purchase_id = request.POST.get('purchase_id',False)
        vendor = request.POST.get('vendor',False)
        follow_up = request.POST.get('follow_up',False)
        payment_method = request.POST.get('payment_method',False)
        footer_desc = request.POST.get('footer_desc',False)
        account_id = ChartOfAccount.objects.get(account_title = vendor)
        date = datetime.date.today()

        if follow_up:
            follow_up = follow_up
        else:
            follow_up = '2010-06-10'

        purchase_header = PurchaseHeader(purchase_no = purchase_id, date = date, footer_description = footer_desc, payment_method = payment_method, account_id = account_id, follow_up = follow_up)
        items = json.loads(request.POST.get('items'))
        purchase_header.save()
        header_id = PurchaseHeader.objects.get(purchase_no = purchase_id)
        for value in items:
            item_id = Add_item.objects.get(item_code = value["item_code"])
            purchase_detail = PurchaseDetail(item_id = item_id, item_description = "", width = value["width"], height = value["height"], quantity = value["quantity"], meas = value["measurment"], rate = value["rate"], purchase_id = header_id)
            purchase_detail.save()
            total_amount = total_amount + float(value["total"])
        print(total_amount)
        header_id = header_id.id

        cash_in_hand = ChartOfAccount.objects.get(account_title = 'Cash')
        if payment_method == 'Cash':
            tran2 = Transactions(refrence_id = header_id, refrence_date = date, account_id = account_id, tran_type = "Purchase Invoice", amount = total_amount, date = date, remarks = purchase_id)
            tran2.save()
            tran1 = Transactions(refrence_id = header_id, refrence_date = date, account_id = cash_in_hand, tran_type = "Purchase Invoice", amount = -abs(total_amount), date = date, remarks = purchase_id)
            tran1.save()
        else:
            purchase_account = ChartOfAccount.objects.get(account_title = 'Purchases')
            tran1 = Transactions(refrence_id = header_id, refrence_date = date, account_id = account_id, tran_type = "Purchase Invoice On Credit", amount = -abs(total_amount), date = date, remarks = purchase_id)
            tran1.save()
            tran2 = Transactions(refrence_id = header_id, refrence_date = date, account_id = purchase_account, tran_type = "Purchase Invoice On Credit", amount = total_amount, date = date, remarks = purchase_id)
            tran2.save()
        return JsonResponse({'result':'success'})
    return render(request, 'transaction/new_purchase.html',{"all_accounts":all_accounts,"last_purchase_no":last_purchase_no, 'all_item_code':all_item_code})


@login_required()
def edit_purchase(request, pk):
    all_item_code = Add_item.objects.all()
    purchase_header = PurchaseHeader.objects.filter(id=pk).first()
    purchase_detail = PurchaseDetail.objects.filter(purchase_id=pk).all()
    all_accounts = ChartOfAccount.objects.all()
    item_code = request.POST.get('item_code_purchase', False)
    if item_code:
        data = Add_item.objects.filter(product_code=item_code)
        row = serializers.serialize('json', data)
        return HttpResponse(json.dumps({'row': row}))
    if request.method == 'POST':
        purchase_detail.delete()

        purchase_id = request.POST.get('purchase_id', False)
        supplier = request.POST.get('supplier', False)
        follow_up = request.POST.get('follow_up', False)
        payment_method = request.POST.get('payment_method', False)
        credit_days = request.POST.get('credit_days', False)
        footer_desc = request.POST.get('footer_desc', False)
        cartage_amount = request.POST.get('cartage_amount', False)
        additional_tax = request.POST.get('additional_tax', False)
        withholding_tax = request.POST.get('withholding_tax', False)
        account_id = ChartOfAccount.objects.get(account_title=supplier)
        print(follow_up)
        if follow_up:
            follow_up = follow_up
        else:
            follow_up = '2010-06-10'
        date = datetime.date.today()
        purchase_header.credit_days = credit_days
        purchase_header.follow_up = follow_up
        purchase_header.payment_method = payment_method
        purchase_header.footer_description = footer_desc
        purchase_header.cartage_amount = cartage_amount
        purchase_header.additional_tax = additional_tax
        purchase_header.withholding_tax = withholding_tax
        purchase_header.account_id = account_id

        purchase_header.save()

        items = json.loads(request.POST.get('items'))
        purchase_header.save()
        header_id = PurchaseHeader.objects.get(purchase_no=purchase_id)
        for value in items:
            purchase_detail = PurchaseDetail(item_code=value["item_code"], item_name=value["item_name"],
                                             item_description=value["item_description"], quantity=value["quantity"],
                                             unit=value["unit"], cost_price=value["price"], retail_price=0,
                                             sales_tax=value["sales_tax"], purchase_id=header_id)
            purchase_detail.save()
        return JsonResponse({'result': 'success'})
    return render(request, 'transaction/edit_purchase.html',
                  {'all_item_code': all_item_code, 'all_accounts': all_accounts, 'purchase_header': purchase_header,
                   'purchase_detail': purchase_detail, 'pk': pk})


@login_required()
def purchase_return_summary(request):
    all_purchase_return = PurchaseReturnHeader.objects.all()
    return render(request, 'transaction/purchase_return_summary.html', {'all_purchase_return': all_purchase_return})


@login_required()
def sale(request):
    all_sales = SaleHeader.objects.all()
    return render(request, 'transaction/sale.html',{"all_sales": all_sales})


@login_required()
def new_sale(request):
    total_amount = 0
    serial = "0"
    last_sale_no = SaleHeader.objects.last()
    all_job_order = JobOrderHeader.objects.all()
    all_accounts = ChartOfAccount.objects.all()
    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if last_sale_no:
        last_sale_no = last_sale_no.sale_no[6:]
        serial = str((int(last_sale_no)+1))
        # count = last_sale_no.count('0')
        last_sale_no = date[2:]+'SI'+serial
    else:
        last_sale_no =  date[2:]+'SI1'
    print(last_sale_no)
    job_no_sale = request.POST.get('job_no_sale')
    if job_no_sale:
        header_job = JobOrderHeader.objects.get(job_no = job_no_sale)
        print(header_job.id)
        cursor = connection.cursor()
        items = cursor.execute('''select inventory_add_item.item_code, inventory_add_item.item_name, inventory_add_item.item_description,transaction_joborderdetail.meas, transaction_joborderdetail.width, transaction_joborderdetail.height, transaction_joborderdetail.quantity
                                from transaction_joborderdetail
                                inner join inventory_add_item on transaction_joborderdetail.item_id_id = inventory_add_item.id
                                where transaction_joborderdetail.header_id_id = %s
                                ''',[header_job.id])
        items = items.fetchall()
        return JsonResponse({"items":items})
    if request.method == "POST":
        sale_id = request.POST.get('sale_id',False)
        print(sale_id)
        customer = request.POST.get('customer',False)
        follow_up = request.POST.get('follow_up',False)
        payment_method = request.POST.get('payment_method',False)
        footer_desc = request.POST.get('footer_desc',False)
        account_id = ChartOfAccount.objects.get(account_title = customer)
        date = datetime.date.today()

        if follow_up:
            follow_up = follow_up
        else:
            follow_up = '2010-06-10'
        sale_header = SaleHeader(sale_no = last_sale_no, date = date, footer_description = footer_desc, payment_method = payment_method, account_id = account_id, follow_up = follow_up,)
        sale_header.save()
        items = json.loads(request.POST.get('items'))
        header_id = SaleHeader.objects.get(sale_no = sale_id)
        for value in items:
            item_id = Add_item.objects.get(item_code = value["item_code"])
            sale_detail = SaleDetail(item_id = item_id, item_description = "", width = value["width"], height = value["height"], quantity = value["quantity"], meas = value["measurment"], rate = value["rate"], sale_id = header_id)
            sale_detail.save()
            total_amount = total_amount + float(value["total"])
            print(total_amount)
        header_id = header_id.id
        cash_in_hand = ChartOfAccount.objects.get(account_title = 'Cash')
        if payment_method == 'Cash':
            tran1 = Transactions(refrence_id = header_id, refrence_date = date, account_id = cash_in_hand, tran_type = "Sale Invoice", amount = total_amount, date = date, remarks = last_sale_no)
            tran1.save()
            tran2 = Transactions(refrence_id = header_id, refrence_date = date, account_id = account_id, tran_type = "Sale Invoice", amount = -abs(total_amount), date = date, remarks = last_sale_no)
            tran2.save()
        else:
            sale_account = ChartOfAccount.objects.get(account_title = 'Sales')
            tran1 = Transactions(refrence_id = header_id, refrence_date = date, account_id = account_id, tran_type = "Sale Invoice On Credit", amount = total_amount, date = date, remarks = last_sale_no)
            tran1.save()
            tran2 = Transactions(refrence_id = header_id, refrence_date = date, account_id = sale_account, tran_type = "Sale Invoice On Credit", amount = -abs(total_amount), date = date, remarks = last_sale_no)
            tran2.save()
        return JsonResponse({'result':'success'})
    return render(request, 'transaction/new_sale.html',{"all_accounts":all_accounts,"last_sale_no":last_sale_no, 'all_job_order':all_job_order})


@login_required()
def edit_sale(request, pk):
    job_no = JobOrderHeader.objects.all()
    sale_header = SaleHeader.objects.filter(id=pk).first()
    sale_detail = SaleDetail.objects.filter(sale_id=pk).all()
    all_accounts = ChartOfAccount.objects.all()
    item_code = request.POST.get('item_code_sale', False)
    cursor = connection.cursor()
    # all_dc = cursor.execute('''Select Distinct id,dc_no From (
    #                                Select distinct dc_id_id,DC.item_code,DC.Item_name,
    #                                DC.Quantity As DcQuantity,
    #                                ifnull(sum(SD.Quantity),0) As SaleQuantity,
    #                                (DC.Quantity-ifnull(Sum(SD.Quantity),0)) As RemainingQuantity
    #                                from customer_dcdetailcustomer DC
    #                                Left Join transaction_saledetail SD on SD.dc_ref = DC.dc_id_id
    #                                And SD.item_code = DC.item_code
    #                                group by dc_id_id,dc.item_code,dc.Item_name
    #                                ) As tblData
    #                                Inner Join customer_dcheadercustomer  HD on  HD.id = tblData.dc_id_id
    #                                Where RemainingQuantity > 0''')
    # all_dc = all_dc.fetchall()
    # dc_code_sale_edit = request.POST.get('dc_code_sale_edit')
    # if dc_code_sale_edit:
    #     header_id = DcHeaderCustomer.objects.get(dc_no=dc_code_sale_edit)
    #     data = cursor.execute('''Select * From (
    #                            Select distinct dc_id_id,DC.item_code,DC.Item_name, DC.item_description, DC.unit,
    #                            DC.Quantity As DcQuantity,
    #                            ifnull(sum(SD.Quantity),0) As SaleQuantity,
    #                            (DC.Quantity-ifnull(Sum(SD.Quantity),0)) As RemainingQuantity
    #                            from customer_dcdetailcustomer DC
    #                            Left Join transaction_saledetail SD on SD.dc_ref = DC.dc_id_id
    #                            And SD.item_code = DC.item_code
    #                            group by dc_id_id,dc.item_code,dc.Item_name
    #                            ) As tblData
    #                            Where RemainingQuantity > 0 And dc_id_id = %s
    #                            ''', [header_id.id])
    #     row = data.fetchall()
    #     return JsonResponse({"row": row, 'dc_ref': header_id.id})
    if request.method == 'POST':
        sale_detail.delete()

        sale_id = request.POST.get('sale_id', False)
        customer = request.POST.get('customer', False)
        credit_days = request.POST.get('credit_days', False)
        follow_up = request.POST.get('follow_up', False)
        payment_method = request.POST.get('payment_method', False)
        footer_desc = request.POST.get('footer_desc', False)
        cartage_amount = request.POST.get('cartage_amount', False)
        additional_tax = request.POST.get('additional_tax', False)
        withholding_tax = request.POST.get('withholding_tax', False)
        account_id = ChartOfAccount.objects.get(account_title=customer)
        date = datetime.date.today()

        if follow_up:
            follow_up = follow_up
        else:
            follow_up = '2010-06-10'

        sale_header.follow_up = follow_up
        sale_header.credit_days = credit_days
        sale_header.payment_method = payment_method
        sale_header.footer_description = footer_desc
        sale_header.cartage_amount = cartage_amount
        sale_header.additional_tax = additional_tax
        sale_header.withholding_tax = withholding_tax
        sale_header.account_id = account_id

        sale_header.save()

        items = json.loads(request.POST.get('items'))
        sale_header.save()
        header_id = SaleHeader.objects.get(sale_no=sale_id)
        for value in items:
            print(value["dc_no"])
            sale_detail = SaleDetail(item_code=value["item_code"], item_name=value["item_name"],
                                     item_description=value["item_description"], quantity=value["quantity"],
                                     unit=value["unit"], cost_price=value["price"], retail_price=0,
                                     sales_tax=value["sales_tax"], sale_id=header_id, dc_ref=value["dc_no"])
            sale_detail.save()
        return JsonResponse({'result': 'success'})
    return render(request, 'transaction/edit_sale.html',
                  {'job_no': job_no, 'sale_header': sale_header, 'sale_detail': sale_detail})



@login_required()
def sale_return_summary(request):
    all_sales_return = SaleReturnHeader.objects.all()
    return render(request, 'transaction/sale_return_summary.html', {'all_sales_return': all_sales_return})


@login_required()
def chart_of_account(request):
    all_accounts_null = ChartOfAccount.objects.filter(parent_id = 0).all()
    all_accounts = ChartOfAccount.objects.all()

    if request.method == 'POST':
        account_title = request.POST.get('account_title')
        account_type = request.POST.get('account_type')
        opening_balance = request.POST.get('opening_balance')
        phone_no = request.POST.get('phone_no')
        email_address = request.POST.get('email_address')
        ntn = request.POST.get('ntn')
        stn = request.POST.get('stn')
        cnic = request.POST.get('cnic')
        address = request.POST.get('address')
        remarks = request.POST.get('remarks')
        op_type = request.POST.get('optradio')
        credit_limits = request.POST.get('credit_limits')

        if opening_balance is "":
            opening_balance = 0.00
        if op_type == "credit":
            opening_balance = -abs(int(opening_balance))
        if credit_limits is "":
            credit_limits = 0.00
        coa = ChartOfAccount(account_title = account_title, parent_id = account_type, opening_balance = opening_balance, phone_no = phone_no, email_address = email_address, ntn = ntn, stn = stn, cnic = cnic ,Address = address, remarks = remarks, credit_limit=credit_limits)
        coa.save()
    return render(request, 'transaction/chart_of_account.html',{'all_accounts_null':all_accounts_null,'all_accounts':all_accounts})


@login_required()
def sale_return_summary(request):

    return render(request, 'transaction/sale_return_summary.html')


@login_required()
def print_purchase(request,pk):
    lines = 0
    total_amount = 0
    total_quantity = 0
    total_square_fit = 0
    square_fit = 0
    header = PurchaseHeader.objects.filter(id = pk).first()
    detail = PurchaseDetail.objects.filter(purchase_id = pk).all()
    image = Company_info.objects.first()
    for value in detail:
        lines = lines + len(value.item_description.split('\n'))
        square_fit = float(value.width * value.height)
        gross = square_fit * float(value.rate)
        amount = gross * float(value.quantity)
        total_amount = total_amount + amount
        total_quantity = (total_quantity + value.quantity)
        square_fit = value.height * value.width
        total_square_fit = total_square_fit + square_fit
    lines = lines + len(detail) + len(detail)
    total_lines = 36 - lines
    pdf = render_to_pdf('transaction/purchase_pdf.html', {'header':header, 'detail':detail,'image':image, 'total_lines':12, 'total_amount':total_amount, 'total_quantity':total_quantity,'total_square_fit':total_square_fit})
    if pdf:
        response = HttpResponse(pdf, content_type='application/pdf')
        filename = "Purchase_%s.pdf" %(header.purchase_no)
        content = "inline; filename='%s'" %(filename)
        response['Content-Disposition'] = content
        return response
    return HttpResponse("Not found")


@login_required()
def print_sale(request, pk):
    lines = 0
    total_amount = 0
    total_quantity = 0
    total_square_fit = 0
    square_fit = 0
    header = SaleHeader.objects.filter(id = pk).first()
    detail = SaleDetail.objects.filter(sale_id = pk).all()
    image = Company_info.objects.first()
    for value in detail:
        lines = lines + len(value.item_description.split('\n'))
        square_fit = float(value.width * value.height)
        gross = square_fit * float(value.rate)
        amount = gross * float(value.quantity)
        total_amount = total_amount + amount
        total_quantity = (total_quantity + value.quantity)
        square_fit = value.height * value.width
        total_square_fit = total_square_fit + square_fit
    lines = lines + len(detail) + len(detail)
    total_lines = 36 - lines
    pdf = render_to_pdf('transaction/sale_pdf.html', {'header':header, 'detail':detail,'image':image, 'total_lines':12, 'total_amount':total_amount, 'total_quantity':total_quantity,'total_square_fit':total_square_fit})
    if pdf:
        response = HttpResponse(pdf, content_type='application/pdf')
        filename = "Sale_%s.pdf" % (header.sale_no)
        content = "inline; filename='%s'" % (filename)
        response['Content-Disposition'] = content
        return response
    return HttpResponse("Not found")


@login_required()
def journal_voucher(request):
    serial = "1"
    cursor = connection.cursor()
    get_last_tran_id = cursor.execute('''select * from transaction_voucherheader where voucher_no LIKE '%JV%'
                                        order by voucher_no DESC LIMIT 1''')
    get_last_tran_id = get_last_tran_id.fetchall()

    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if get_last_tran_id:
        get_last_tran_id = get_last_tran_id[0][1]
        get_last_tran_id = get_last_tran_id[6:]
        serial = str((int(get_last_tran_id) + 1))
        # count = last_sale_no.count('0')
        get_last_tran_id = date[2:]+'JV'+serial
    else:
        get_last_tran_id =  date[2:]+'JV1'
    account_id = request.POST.get('account_title', False)
    all_accounts = ChartOfAccount.objects.all()
    if account_id:
        account_info = ChartOfAccount.objects.filter(id=account_id).first()
        account_title = account_info.account_title
        account_id = account_info.id
        return JsonResponse({'account_title': account_title, 'account_id': account_id})
    if request.method == "POST":
        doc_no = request.POST.get('doc_no', False)
        doc_date = request.POST.get('doc_date', False)
        description = request.POST.get('description', False)
        items = json.loads(request.POST.get('items', False))
        jv_header = VoucherHeader(voucher_no=get_last_tran_id, doc_no=doc_no, doc_date=doc_date, cheque_no="-",
                                  cheque_date=doc_date, description=description)
        jv_header.save()
        header_id = VoucherHeader.objects.get(voucher_no = get_last_tran_id)
        for value in items:
            account_id = ChartOfAccount.objects.get(account_title=value["account_title"])
            if value["debit"] > "0" and value["debit"] > "0.00":
                tran1 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='JV',
                                     amount=abs(float(value["debit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran1.save()
                jv_detail1 = VoucherDetail(account_id=account_id, debit=abs(float(value["debit"])), credit=0.00,header_id=header_id)
                jv_detail1.save()
            print(value["debit"])
            if value["credit"] > "0" and value["credit"] > "0.00":
                print("run")
                print(value["credit"])
                tran2 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='JV',
                                     amount=-abs(float(value["credit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran2.save()
                jv_detail2 = VoucherDetail(account_id=account_id, debit=0.00, credit=-abs(float(value["credit"])),header_id=header_id)
                jv_detail2.save()
        return JsonResponse({"result": "success"})
    return render(request, 'transaction/journal_voucher.html',{"all_accounts": all_accounts, 'get_last_tran_id': get_last_tran_id})


def bank_receiving_voucher(request):
    return render(request, 'transaction/bank_receiving_voucher.html')


def new_bank_receiving_voucher(request):
    cursor = connection.cursor()
    get_last_tran_id = cursor.execute('''select * from transaction_voucherheader where voucher_no LIKE '%BRV%'
                                        order by voucher_no DESC LIMIT 1''')
    get_last_tran_id = get_last_tran_id.fetchall()
    print(get_last_tran_id)

    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if get_last_tran_id:
        get_last_tran_id = get_last_tran_id[0][1]
        get_last_tran_id = get_last_tran_id[7:]
        serial = str((int(get_last_tran_id) + 1))
        # count = last_sale_no.count('0')
        get_last_tran_id = date[2:]+'BRV'+serial
    else:
        get_last_tran_id =  date[2:]+'BRV1'
    account_id = request.POST.get('account_title', False)
    all_accounts = ChartOfAccount.objects.all()
    if account_id:
        account_info = ChartOfAccount.objects.filter(id=account_id).first()
        account_title = account_info.account_title
        account_id = account_info.id
        return JsonResponse({'account_title': account_title, 'account_id': account_id})
    if request.method == "POST":
        doc_no = request.POST.get('doc_no', False)
        doc_date = request.POST.get('doc_date', False)
        description = request.POST.get('description', False)
        cheque_no = request.POST.get('cheque_no', False)
        cheque_date = request.POST.get('cheque_date', False)

        items = json.loads(request.POST.get('items', False))
        jv_header = VoucherHeader(voucher_no=get_last_tran_id, doc_no=doc_no, doc_date=doc_date, cheque_no=cheque_no,
                                  cheque_date=cheque_date, description=description)
        jv_header.save()
        header_id = VoucherHeader.objects.get(voucher_no = get_last_tran_id)
        for value in items:
            account_id = ChartOfAccount.objects.get(account_title=value["account_title"])
            if value["debit"] > "0" and value["debit"] > "0.00":
                tran1 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='BRV',
                                     amount=abs(float(value["debit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran1.save()
                jv_detail1 = VoucherDetail(account_id=account_id, debit=abs(float(value["debit"])), credit=0.00, header_id = header_id)
                jv_detail1.save()
            print(value["debit"])
            if value["credit"] > "0" and value["credit"] > "0.00":
                print("run")
                print(value["credit"])
                tran2 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='BRV',
                                     amount=-abs(float(value["credit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran2.save()
                jv_detail2 = VoucherDetail(account_id=account_id, debit=0.00, credit=-abs(float(value["credit"])), header_id = header_id)
                jv_detail2.save()
        return JsonResponse({"result": "success"})
    return render(request, 'transaction/new_bank_receiving_voucher.html', {'all_accounts': all_accounts, 'get_last_tran_id': get_last_tran_id})


def new_bank_payment_voucher(request):
    cursor = connection.cursor()
    get_last_tran_id = cursor.execute('''select * from transaction_voucherheader where voucher_no LIKE '%BPV%'
                                        order by voucher_no DESC LIMIT 1''')
    get_last_tran_id = get_last_tran_id.fetchall()
    print(get_last_tran_id)

    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if get_last_tran_id:
        get_last_tran_id = get_last_tran_id[0][1]
        get_last_tran_id = get_last_tran_id[7:]
        serial = str((int(get_last_tran_id) + 1))
        # count = last_sale_no.count('0')
        get_last_tran_id = date[2:]+'BPV'+serial
    else:
        get_last_tran_id =  date[2:]+'BPV1'
    account_id = request.POST.get('account_title', False)
    all_accounts = ChartOfAccount.objects.all()
    if account_id:
        account_info = ChartOfAccount.objects.filter(id=account_id).first()
        account_title = account_info.account_title
        account_id = account_info.id
        return JsonResponse({'account_title': account_title, 'account_id': account_id})
    if request.method == "POST":
        doc_no = request.POST.get('doc_no', False)
        doc_date = request.POST.get('doc_date', False)
        cheque_no = request.POST.get('cheque_no', False)
        cheque_date = request.POST.get('cheque_date', False)
        description = request.POST.get('description', False)
        items = json.loads(request.POST.get('items', False))
        if cheque_date:
            cheque_date = cheque_date
        else:
            cheque_date = "2010-10-06"
        jv_header = VoucherHeader(voucher_no=get_last_tran_id, doc_no=doc_no, doc_date=doc_date, cheque_no=cheque_no,
                                  cheque_date=cheque_date, description=description)
        jv_header.save()
        header_id = VoucherHeader.objects.get(voucher_no = get_last_tran_id)
        for value in items:
            print("this")
            account_id = ChartOfAccount.objects.get(account_title=value["account_title"])
            if value["debit"] > "0" and value["debit"] > "0.00":
                tran1 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CRV',
                                     amount=abs(float(value["debit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran1.save()
                jv_detail1 = VoucherDetail(account_id=account_id, debit=abs(float(value["debit"])), credit=0.00,header_id = header_id)
                jv_detail1.save()
            print(value["debit"])
            if value["credit"] > "0" and value["credit"] > "0.00":
                print("run")
                print(value["credit"])
                tran2 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CRV',
                                     amount=-abs(float(value["credit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran2.save()
                jv_detail2 = VoucherDetail(account_id=account_id, debit=0.00, credit=-abs(float(value["credit"])))
                jv_detail2.save()
        return JsonResponse({"result": "success"})
    return render(request, 'transaction/new_bank_payment_voucher.html', {'all_accounts': all_accounts, 'get_last_tran_id': get_last_tran_id})


def bank_payment_voucher(request):
    return render(request, 'transaction/bank_payment_voucher.html')


def edit_bank_receiving_voucher(request):
    return render(request, 'transaction/edit_bank_receiving_voucher.html')


def edit_bank_payment_voucher(request):
    return render(request, 'transaction/edit_bank_receiving_voucher.html')


def reports(request):
    all_accounts = ChartOfAccount.objects.all()
    return render(request, 'transaction/reports.html', {'all_accounts': all_accounts})


def trial_balance(request):
    if request.method == 'POST':
        debit_amount = 0
        credit_amount = 0
        from_date = request.POST.get('from_date')
        to_date = request.POST.get('to_date')
        company_info = Company_info.objects.all()
        cursor = connection.cursor()
        cursor.execute('''Select id,account_title,ifnull(amount,0) + opening_balance As Amount
                        from transaction_chartofaccount
                        Left Join
                        (select account_id_id,sum(AMount) As Amount from transaction_transactions
                        Where transaction_transactions.date Between %s And %s
                        Group By account_id_id) As tbltran On transaction_chartofaccount.id = tbltran.account_id_id
                        ''',[from_date, to_date])
        row = cursor.fetchall()
        for value in row:
            if value[2] >= 0:
                debit_amount = debit_amount + value[2]
            else:
                credit_amount = credit_amount + value[2]
        pdf = render_to_pdf('transaction/trial_balance_pdf.html', {'company_info':company_info, 'row': row, 'debit_amount': debit_amount, 'credit_amount': credit_amount,'from_date':from_date,'to_date':to_date})
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = 'TrialBalance%s.pdf' %('000')
            content = "inline; filename='%s'" %(filename)
            response['Content-Disposition'] = content
            return response
        return HttpResponse("Not Found")
    return redirect('report')


def account_ledger(request):
    if request.method == "POST":
        debit_amount = 0
        credit_amount = 0
        pk = request.POST.get('account_title')
        from_date = request.POST.get('from_date')
        to_date = request.POST.get('to_date')
        company_info = Company_info.objects.all()
        image = Company_info.objects.filter(id=1).first()
        cursor = connection.cursor()
        cursor.execute('''Select tran_type,refrence_id,refrence_date,date,remarks,
                        Case When amount > -1 Then  amount Else 0 End As Debit,
                        Case When amount < -1 Then  amount Else 0 End As Credit
                        From transaction_transactions
                        Where transaction_transactions.date Between %s And %s and transaction_transactions.account_id_id = %s
                        Order By refrence_date Asc
                    ''',[from_date, to_date, pk])
        row = cursor.fetchall()
        print(row)
        for value in row:
            print(value)
        if row:
            for v in row:
                if v[5] >= 0:
                    debit_amount = debit_amount + v[5]
                if v[6] <= 0:
                    credit_amount = credit_amount + v[6]
        account_id = ChartOfAccount.objects.filter(id = pk).first()
        account_title = account_id.account_title
        id = account_id.id
        pdf = render_to_pdf('transaction/account_ledger_pdf.html', {'company_info':company_info,'image':image,'row':row, 'debit_amount':debit_amount, 'credit_amount': credit_amount, 'account_title':account_title, 'from_date':from_date,'to_date':to_date,'id':id})
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = "TrialBalance%s.pdf" %("000")
            content = "inline; filename='%s'" %(filename)
            response['Content-Disposition'] = content
            return response
        return HttpResponse("Not found")
    return redirect('reports')


def new_cash_receiving_voucher(request):
    cursor = connection.cursor()
    get_last_tran_id = cursor.execute('''select * from transaction_voucherheader where voucher_no LIKE '%CRV%'
                                        order by voucher_no DESC LIMIT 1''')
    get_last_tran_id = get_last_tran_id.fetchall()
    print(get_last_tran_id)

    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if get_last_tran_id:
        get_last_tran_id = get_last_tran_id[0][1]
        get_last_tran_id = get_last_tran_id[7:]
        serial = str((int(get_last_tran_id) + 1))
        # count = last_sale_no.count('0')
        get_last_tran_id = date[2:]+'CRV'+serial
    else:
        get_last_tran_id =  date[2:]+'CRV1'
    account_id = request.POST.get('account_title', False)
    all_accounts = ChartOfAccount.objects.all()
    if account_id:
        account_info = ChartOfAccount.objects.filter(id=account_id).first()
        account_title = account_info.account_title
        account_id = account_info.id
        return JsonResponse({'account_title': account_title, 'account_id': account_id})
    if request.method == "POST":
        doc_no = request.POST.get('doc_no', False)
        doc_date = request.POST.get('doc_date', False)
        description = request.POST.get('description', False)
        items = json.loads(request.POST.get('items', False))
        jv_header = VoucherHeader(voucher_no=get_last_tran_id, doc_no=doc_no, doc_date=doc_date, cheque_no="-",
                                  cheque_date=doc_date, description=description)
        jv_header.save()
        header_id = VoucherHeader.objects.get(voucher_no = get_last_tran_id)
        for value in items:
            account_id = ChartOfAccount.objects.get(account_title=value["account_title"])
            if value["debit"] > "0" and value["debit"] > "0.00":
                tran1 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CRV',
                                     amount=abs(float(value["debit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id)
                tran1.save()
                jv_detail1 = VoucherDetail(account_id=account_id, debit=abs(float(value["debit"])), credit=0.00,header_id=header_id)
                jv_detail1.save()
            print(value["debit"])
            if value["credit"] > "0" and value["credit"] > "0.00":
                print("run")
                print(value["credit"])
                tran2 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CRV',
                                     amount=-abs(float(value["credit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran2.save()
                jv_detail2 = VoucherDetail(account_id=account_id, debit=0.00, credit=-abs(float(value["credit"])), header_id=header_id)
                jv_detail2.save()
        return JsonResponse({"result": "success"})
    return render(request, 'transaction/cash_receiving_voucher.html', {"all_accounts": all_accounts, 'get_last_tran_id': get_last_tran_id})


def cash_payment_voucher(request):
    cursor = connection.cursor()
    get_last_tran_id = cursor.execute('''select * from transaction_voucherheader where voucher_no LIKE '%CPV%'
                                        order by voucher_no DESC LIMIT 1''')
    get_last_tran_id = get_last_tran_id.fetchall()
    print(get_last_tran_id)

    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if get_last_tran_id:
        get_last_tran_id = get_last_tran_id[0][1]
        get_last_tran_id = get_last_tran_id[7:]
        serial = str((int(get_last_tran_id) + 1))
        # count = last_sale_no.count('0')
        get_last_tran_id = date[2:]+'CPV'+serial
    else:
        get_last_tran_id =  date[2:]+'CPV1'
    account_id = request.POST.get('account_title', False)
    all_accounts = ChartOfAccount.objects.all()
    if account_id:
        account_info = ChartOfAccount.objects.filter(id=account_id).first()
        account_title = account_info.account_title
        account_id = account_info.id
        return JsonResponse({'account_title': account_title, 'account_id': account_id})
    if request.method == "POST":
        doc_no = request.POST.get('doc_no', False)
        doc_date = request.POST.get('doc_date', False)
        description = request.POST.get('description', False)
        items = json.loads(request.POST.get('items', False))
        jv_header = VoucherHeader(voucher_no=get_last_tran_id, doc_no=doc_no, doc_date=doc_date, cheque_no="-",
                                  cheque_date=doc_date, description=description)
        jv_header.save()
        header_id = VoucherHeader.objects.get(voucher_no = get_last_tran_id)
        for value in items:
            print("this")
            account_id = ChartOfAccount.objects.get(account_title=value["account_title"])
            if value["debit"] > "0" and value["debit"] > "0.00":
                tran1 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CPV',
                                     amount=abs(float(value["debit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id)
                tran1.save()
                jv_detail1 = VoucherDetail(account_id=account_id, debit=abs(float(value["debit"])), credit=0.00,header_id=header_id)
                jv_detail1.save()
            print(value["debit"])
            if value["credit"] > "0" and value["credit"] > "0.00":
                print("run")
                print(value["credit"])
                tran2 = Transactions(refrence_id=doc_no, refrence_date=doc_date, tran_type='CPV',
                                     amount=-abs(float(value["credit"])),
                                     date=datetime.date.today(), remarks=get_last_tran_id, account_id=account_id, )
                tran2.save()
                jv_detail2 = VoucherDetail(account_id=account_id, debit=0.00, credit=-abs(float(value["credit"])), header_id=header_id)
                jv_detail2.save()
        return JsonResponse({"result": "success"})
    return render(request, 'transaction/cash_payment_voucher.html',
                  {"all_accounts": all_accounts, 'get_last_tran_id': get_last_tran_id})

def job_order(request):
    return render(request, 'transaction/job_order.html')

def new_job_order(request):
    serial = "1"
    last_job_no = JobOrderHeader.objects.last()
    all_item_code = Add_item.objects.all()
    all_accounts = ChartOfAccount.objects.all()
    date = datetime.date.today()
    date = date.strftime('%Y%m')
    if last_job_no:
        get_job_no = last_job_no.job_no[6:]
        serial = str((int(get_job_no) + 1))
        count = get_job_no.count('0')
        get_job_no = date[2:]+'JO'+serial.zfill(count+1)
    else:
        get_job_no =  date[2:]+'JO'+serial.zfill(5)
    item_code = request.POST.get('item_code', False)
    if item_code:
        row = Add_item.objects.filter(item_code = item_code)
        row = serializers.serialize('json',row)
        return HttpResponse(json.dumps({'row':row}))
    if request.method == 'POST':
        client_name = request.POST.get('client_name', False)
        file_name = request.POST.get('file_name', False)
        delivery_date = request.POST.get('delivery_date', False)
        remarks = request.POST.get('remarks', False)
        items = json.loads(request.POST.get('items'))
        if delivery_date:
            delivery_date = delivery_date
        else:
            delivery_date = "2010-10-06"
        account_id = ChartOfAccount.objects.get(account_title = client_name)
        job_order_header = JobOrderHeader(job_no = get_job_no, file_name = file_name, delivery_date = delivery_date, remarks = remarks, account_id = account_id)
        job_order_header.save()
        header_id = JobOrderHeader.objects.get(job_no = get_job_no)
        for value in items:
            item_id = Add_item.objects.get(item_code = value["item_code"])
            job_order_detail = JobOrderDetail(item_id = item_id, width = value["width"], height = value["height"], quantity = value["quantity"], meas = value["measurment"], header_id = header_id)
            job_order_detail.save()
        return JsonResponse({"result":"success"})
    return render(request, 'transaction/new_job_order.html',{"get_job_no":get_job_no,"all_item_code":all_item_code,"all_accounts":all_accounts})
