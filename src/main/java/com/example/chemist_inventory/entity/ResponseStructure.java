package com.example.chemist_inventory.entity;

public class ResponseStructure<T> {
    private String message;
    private int statuscode;
    private T data;

    public ResponseStructure() {
        super();
    }

    public ResponseStructure(String message, int statuscode, T data) {
        this.message = message;
        this.statuscode = statuscode;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatuscode() {
        return statuscode;
    }

    public void setStatuscode(int statuscode) {
        this.statuscode = statuscode;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
