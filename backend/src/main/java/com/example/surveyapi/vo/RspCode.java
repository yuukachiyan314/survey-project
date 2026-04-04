package com.example.surveyapi.vo;

public enum RspCode {
    SUCCESS(200, "success"),
    BAD_REQUEST(400, "bad request"),
    NOT_FOUND(404, "not found"),
    ERROR(500, "error");

    public final int code;
    public final String message;

    RspCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}