package com.cafe.domain.service;
import com.cafe.domain.model.OrderItem;
import java.util.List;
public interface PricingStrategy {
    String getStrategyName();
    double calculateTotal(List<OrderItem> items);
}
