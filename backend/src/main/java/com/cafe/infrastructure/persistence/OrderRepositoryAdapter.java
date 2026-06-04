package com.cafe.infrastructure.persistence;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderStatus;
import com.cafe.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepository {
    private final SpringDataOrderRepository jpaRepository;
    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll();
    }
    @Override
    public Optional<Order> findById(Long id) {
        return jpaRepository.findById(id);
    }
    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return jpaRepository.findByStatus(status);
    }
    @Override
    public Order save(Order order) {
        return jpaRepository.save(order);
    }
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
}
