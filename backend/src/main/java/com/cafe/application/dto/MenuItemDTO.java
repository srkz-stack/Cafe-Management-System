package com.cafe.application.dto;
import com.cafe.domain.model.Category;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Category category;
    private Boolean available;
}
