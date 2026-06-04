package com.cafe.application.dto;
import com.cafe.domain.model.OrderStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private Double totalPrice;
    private String pricingType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
