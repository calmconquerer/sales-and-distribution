from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='transaction-home'),

    path('chart_of_account/', views.chart_of_account, name='chart-of-account'),
    path('reports/', views.reports, name='reports'),

    path('purchase/', views.purchase, name='purchase'),
    path('purchase/new/', views.new_purchase, name='new-purchase'),
    path('purchase_return_summary/', views.purchase_return_summary, name='purchase-return'),
    path('purchase/print/<pk>', views.print_purchase, name='purchase-print'),
    path('purchase/edit/<int:pk>', views.edit_purchase, name='edit-purchase'),

    path('sale/', views.sale, name='sale'),
    path('sale/new/', views.new_sale, name='new-sale'),
    path('sale_return/', views.sale_return_summary, name='sale-return'),
    path('sale/print/<int:pk>', views.print_sale, name='sale-print'),
    path('sale/edit/<pk>', views.edit_sale, name='edit-sale'),

    path('journal_voucher/new', views.journal_voucher, name='journal-voucher'),
    path('journal_voucher/edit', views.edit_journal_voucher, name='edit-journal-voucher'),
    path('bank_receiving_voucher', views.bank_receiving_voucher, name='bank-receiving-voucher'),
    path('bank_receiving_voucher/new', views.new_bank_receiving_voucher, name='new-bank-receiving'),
    path('bank_payment_voucher/', views.bank_payment_voucher, name='bank-payment-voucher'),
    path('bank_payment_voucher/new', views.new_bank_payment_voucher, name='new-bank-payment'),
    path('bank_payment_voucher/edit', views.edit_bank_payment_voucher, name='edit-bank-payment'),
    path('bank_receiving_voucher/edit', views.edit_bank_receiving_voucher, name='edit-bank-receiving'),
    path('trial_balance/pdf/', views.trial_balance, name = 'trial-balance'),
    path('account_ledger/pdf/', views.account_ledger, name='account-ledger'),
    path('cash_receiving_voucher/new/', views.new_cash_receiving_voucher, name='cash-receiving-voucher'),
    path('cash_receiving_voucher/edit', views.edit_bank_receiving_voucher, name='edit-receiving'),
    path('cash_payment_voucher/new/', views.cash_payment_voucher, name='cash-payment-voucher'),
    path('cash_payment_voucher/edit', views.edit_cash_payment, name='edit-cash-payment'),


    path('job_order/', views.job_order, name='job-order'),
    path('job_order/new/', views.new_job_order, name='new-job-order'),
]
