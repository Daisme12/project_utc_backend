package com.utc.backend.common;

public class AppConstants {

    // Pagination defaults
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";

    // Date-time pattern
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DATE_FORMAT = "yyyy-MM-dd";

    // Role codes
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_CASHIER = "CASHIER";
    public static final String ROLE_CUSTOMER = "CUSTOMER";

    // Order status
    public static final String ORDER_STATUS_PENDING = "PENDING";
    public static final String ORDER_STATUS_COMPLETED = "COMPLETED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";

    // Payment status
    public static final String PAYMENT_STATUS_UNPAID = "UNPAID";
    public static final String PAYMENT_STATUS_PAID = "PAID";
    public static final String PAYMENT_STATUS_FAILED = "FAILED";

    // Inventory transaction types
    public static final String TRANSACTION_IMPORT = "IMPORT";
    public static final String TRANSACTION_EXPORT = "EXPORT";
    public static final String TRANSACTION_ADJUST = "ADJUST";
}
