from django.shortcuts import render
from django.http import JsonResponse
from .models import Add_item
from django.db import connection
import json



def add_item(request):
    get_item_code = Add_item.objects.last()
    if get_item_code:
        get_item_code = get_item_code.item_code
        serial_no = get_item_code[8:]
        serial_no = int(serial_no) + 1
    else:
        inc = 1
        serial_no = int('101')
    item_name = request.POST.get("item_name")
    item_desc = request.POST.get("item_desc")
    unit = request.POST.get("unit")
    type = request.POST.get("type")
    size = request.POST.get("size")
    opening_stock = request.POST.get("opening_stock")
    print(unit)
    if item_name and item_desc and type and size:
        return JsonResponse({"item_name":item_name,"item_desc":item_desc,"unit":unit,"type":type,"size":size,"opening_stock":opening_stock})
    if request.method == "POST":
        items = json.loads(request.POST.get('items'))
        for value in items:
            type = value["type"][:3]
            size = value["size"][:3]
            item_code = type+"-"+size+"-"+str(serial_no)
            new_products = Add_item(item_code = item_code, item_name = value["item_name"], item_description = value["item_desc"]  ,unit = value["unit"] ,opening_stock = value["opening_stock"], type = value["type"], size = value["size"])
            new_products.save()
            return JsonResponse({"success":"success"})
    return render(request,'inventory/add_item.html')


def stock(request):
    cursor = connection.cursor()
    stock = cursor.execute('''Select itemID,Size,item_code, item_name,Item_description,Unit,SUM(quantity) As qty From (
                    Select 'Opening Stock' As TranType,ID As ItemID, Size, Item_Code, Item_name, Item_description, unit,Opening_Stock as Quantity
                    From inventory_add_item
                    union all
                    Select 'Purchase' As TranType,P.ID As ItemID,P.Size, P.Item_Code,P.Item_name,P.Item_description,P.unit,sum(width*height*Quantity)
                    From transaction_purchasedetail H Inner join inventory_add_item P On H.item_id_id = P.id
                    union All
                    Select 'Purchase Return' As TranType,P.ID As ItemID,P.Size,P.Item_Code,P.Item_name,P.Item_description,P.unit,sum(width*height*Quantity) * -1
                    From transaction_purchasereturndetail H Inner join inventory_add_item P On H.item_id_id = P.id
                    union all
                    Select 'Sale' As TranType,P.ID AS ItemID,P.Size,P.Item_Code,P.Item_name,P.Item_description,P.unit,sum(width*height*Quantity) * -1
                    From transaction_saledetail H Inner join inventory_add_item P On H.item_id_id = P.id
                    union all
                    Select 'Sale Return' As TranType,P.ID AS ItemID,P.Size,P.Item_Code,P.Item_name,P.Item_description,P.unit,sum(width*height*Quantity)
                    From transaction_salereturndetail H Inner join inventory_add_item P On H.item_id_id = P.id
                    ) As tblTemp
                    Group by ItemID
                    ''')
    stock = stock.fetchall()
    print(stock)
    return render(request,'inventory/stock.html',{'stock':stock})
