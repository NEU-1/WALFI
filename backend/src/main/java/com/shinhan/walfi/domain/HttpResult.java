package com.shinhan.walfi.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@ToString
@AllArgsConstructor
public class HttpResult {

    private HttpStatus status;

    private Result result;

    private String message;

    private Object data;

    @JsonIgnore
    private String action;

    @JsonIgnore
    private String userId;

    public HttpResult(HttpStatus status, Result result, String message) {
        this.status = status;
        this.result = result;
        this.message = message;
    }

    public static enum Result {
        SUCCESS, ERROR, FAIL
    }

    static public HttpResult getSuccess(){
        HttpResult result = new HttpResult(HttpStatus.OK,Result.SUCCESS,"SUCCESS");
        return result;
    }
}

