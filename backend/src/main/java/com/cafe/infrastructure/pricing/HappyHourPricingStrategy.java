package com.cafe.infrastructure.pricing;
import com.cafe.domain.model.OrderItem;
import com.cafe.domain.service.PricingStrategy;
import org.springframework.stereotype.Component;
import java.util.List;
@Component
public class HappyHourPricingStrategy implements PricingStrategy {
    private static final double DISCOUNT_RATE = 0.20;
    @Override
    public String getStrategyName() {
        return "HAPPY_HOUR";
    }
    @Override
    public double calculateTotal(List<OrderItem> items) {
        double subtotal = items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
        double discount = subtotal * DISCOUNT_RATE;
        return Math.round((subtotal - discount) * 100.0) / 100.0;
    }
}
