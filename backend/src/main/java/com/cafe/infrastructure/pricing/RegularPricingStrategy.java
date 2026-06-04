package com.cafe.infrastructure.pricing;
import com.cafe.domain.model.OrderItem;
import com.cafe.domain.service.PricingStrategy;
import org.springframework.stereotype.Component;
import java.util.List;
@Component
public class RegularPricingStrategy implements PricingStrategy {
    @Override
    public String getStrategyName() {
        return "REGULAR";
    }
    @Override
    public double calculateTotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
    }
}
