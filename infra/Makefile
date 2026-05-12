.PHONY: init plan apply destroy clean help

PLAN_FILE := tfplan

help:
	@echo "Available commands:"
	@echo "  make init   - Initialize Terraform"
	@echo "  make plan   - Plan Terraform changes (generates tfplan)"
	@echo "  make apply  - Apply Terraform changes (uses tfplan)"
	@echo "  make destroy - Destroy Terraform resources"
	@echo "  make clean  - Remove tfplan file"

init:
	terraform init

plan:
	terraform plan -out=$(PLAN_FILE)

apply:
	terraform apply $(PLAN_FILE)

destroy:
	terraform destroy

clean:
	rm -f $(PLAN_FILE)
