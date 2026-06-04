package com.cafe.application.dto;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Double menuItemPrice;
    private Integer quantity;
    private Double subtotal;
}
