package com.cafe.application.dto;
import com.cafe.domain.model.Category;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMenuItemRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    @NotNull(message = "Category is required")
    private Category category;
    @Builder.Default
    private Boolean available = true;
}
