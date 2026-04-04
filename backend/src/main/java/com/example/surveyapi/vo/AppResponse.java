package com.example.surveyapi.vo;

public class AppResponse<T> {
    public int code;
    public String message;
    public T data;

    public static <T> AppResponse<T> success(T data) {
        AppResponse<T> r = new AppResponse<>();
        r.code = RspCode.SUCCESS.code;
        r.message = RspCode.SUCCESS.message;
        r.data = data;
        return r;
    }

    public static <T> AppResponse<T> error(RspCode rc) {
        return error(rc, null);
    }

    public static <T> AppResponse<T> error(RspCode rc, String msg) {
        AppResponse<T> r = new AppResponse<>();
        r.code = rc.code;
        r.message = (msg != null && !msg.isBlank()) ? msg : rc.message;
        r.data = null;
        return r;
    }
}