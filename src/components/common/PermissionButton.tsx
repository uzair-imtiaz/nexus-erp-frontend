import React from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import { usePermissionCheck } from "../../hooks/usePermissionCheck";

interface PermissionButtonProps extends ButtonProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  hideWhenNoAccess?: boolean;
  disableWhenNoAccess?: boolean;
  tooltipWhenDisabled?: string;
}

/**
 * Button component that handles permission-based visibility and state
 *
 * @param permission - Single permission required
 * @param permissions - Array of permissions
 * @param role - Single role required
 * @param roles - Array of roles
 * @param requireAll - Whether all permissions/roles are required
 * @param hideWhenNoAccess - Hide button when no access (default: false)
 * @param disableWhenNoAccess - Disable button when no access (default: true)
 * @param tooltipWhenDisabled - Tooltip to show when button is disabled due to permissions
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  hideWhenNoAccess = false,
  disableWhenNoAccess = true,
  tooltipWhenDisabled = "You don't have permission to perform this action",
  children,
  disabled,
  ...buttonProps
}) => {
  const { hasAccess, isLoading } = usePermissionCheck({
    permission,
    permissions,
    role,
    roles,
    requireAll,
  });

  // If loading, show disabled button
  if (isLoading) {
    return (
      <Button {...buttonProps} disabled loading>
        {children}
      </Button>
    );
  }

  // If no access and should hide, return null
  if (!hasAccess && hideWhenNoAccess) {
    return null;
  }

  // Determine if button should be disabled
  const isDisabled = disabled || (!hasAccess && disableWhenNoAccess);

  // If disabled due to permissions and tooltip is provided, wrap with tooltip
  if (!hasAccess && disableWhenNoAccess && tooltipWhenDisabled) {
    return (
      <Tooltip title={tooltipWhenDisabled}>
        <Button {...buttonProps} disabled={isDisabled}>
          {children}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button {...buttonProps} disabled={isDisabled}>
      {children}
    </Button>
  );
};

export default PermissionButton;
